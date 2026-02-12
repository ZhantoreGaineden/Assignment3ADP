package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Config struct {
	DBHost    string
	DBPort    int
	DBName    string
	DBUser    string
	DBPass    string
	DBSSLMode string
}

type SalesByMonth struct {
	Month  string  `json:"month"` // YYYY-MM
	Count  int64   `json:"count"`
	Amount float64 `json:"amount"`
}

type Summary struct {
	SoldCarsCount      int64          `json:"sold_cars_count"`
	SoldTotalAmount    float64        `json:"sold_total_amount"`
	AvailableCarsCount int64          `json:"available_cars_count"`
	InTransitCarsCount int64          `json:"in_transit_cars_count"`
	LeadsCount         int64          `json:"leads_count"`
	SalesByMonth       []SalesByMonth `json:"sales_by_month"`
	GeneratedAt        time.Time      `json:"generated_at"`
	Error              string         `json:"error,omitempty"`
}

type Server struct {
	db   *sql.DB
	tmpl *template.Template

	mu    sync.RWMutex
	cache Summary
	has   bool
}

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Sprintf("error loading .env file: %w", err)
	}

	cfg, err := loadConfigFromEnv()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	db, err := openPostgres(cfg)
	if err != nil {
		log.Fatalf("db error: %v", err)
	}
	defer db.Close()

	tmpl, err := template.ParseFiles("templates/dashboard.html")
	if err != nil {
		log.Fatalf("template error: %v", err)
	}

	s := &Server{db: db, tmpl: tmpl}

	go s.backgroundRefresh(20 * time.Second)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", s.handleHealth)
	mux.HandleFunc("/analytics/summary", s.handleSummaryJSON)
	mux.HandleFunc("/analytics/dashboard", s.handleDashboardHTML)

	addr := ":3004"
	log.Printf("✅ analytics service running on %s", addr)
	if err := http.ListenAndServe(addr, withMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}

func loadConfigFromEnv() (Config, error) {
	get := func(k string) string { return os.Getenv(k) }

	portStr := get("DB_PORT")
	if portStr == "" {
		portStr = "5432"
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return Config{}, fmt.Errorf("DB_PORT must be int: %w", err)
	}

	cfg := Config{
		DBHost:    get("DB_HOST"),
		DBPort:    port,
		DBName:    get("DB_NAME"),
		DBUser:    get("DB_USER"),
		DBPass:    get("DB_PASS"),
		DBSSLMode: get("DB_SSLMODE"),
	}
	if cfg.DBSSLMode == "" {
		cfg.DBSSLMode = "disable"
	}

	if cfg.DBHost == "" || cfg.DBName == "" || cfg.DBUser == "" || cfg.DBPass == "" {
		return Config{}, errors.New("missing DB_* env vars (DB_HOST/DB_NAME/DB_USER/DB_PASSWORD)")
	}
	return cfg, nil
}

func openPostgres(cfg Config) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBUser, cfg.DBPass, cfg.DBSSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, err
	}
	return db, nil
}

func (s *Server) backgroundRefresh(period time.Duration) {
	ticker := time.NewTicker(period)
	defer ticker.Stop()

	for range ticker.C {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		sum, err := s.computeSummary(ctx)
		cancel()

		if err == nil {
			s.mu.Lock()
			s.cache = sum
			s.has = true
			s.mu.Unlock()
		}
	}
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":  "ok",
		"service": "analytics",
		"time":    time.Now().Format(time.RFC3339),
	})
}

func (s *Server) handleSummaryJSON(w http.ResponseWriter, r *http.Request) {

	s.mu.RLock()
	if s.has {
		sum := s.cache
		s.mu.RUnlock()
		writeJSON(w, http.StatusOK, sum)
		return
	}
	s.mu.RUnlock()

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	sum, err := s.computeSummary(ctx)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}

	s.mu.Lock()
	s.cache = sum
	s.has = true
	s.mu.Unlock()

	writeJSON(w, http.StatusOK, sum)
}

func (s *Server) handleDashboardHTML(w http.ResponseWriter, r *http.Request) {
	var sum Summary

	s.mu.RLock()
	if s.has {
		sum = s.cache
		s.mu.RUnlock()
	} else {
		s.mu.RUnlock()
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		defer cancel()
		tmp, err := s.computeSummary(ctx)
		if err != nil {
			// dashboard должен открываться даже если БД умерла — показываем ошибку
			tmp = Summary{GeneratedAt: time.Now(), Error: err.Error()}
		}
		sum = tmp
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.tmpl.Execute(w, sum); err != nil {
		http.Error(w, "template execute error: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func (s *Server) computeSummary(ctx context.Context) (Summary, error) {
	var sum Summary
	sum.GeneratedAt = time.Now()

	err := s.db.QueryRowContext(ctx, `
		SELECT
			COALESCE(COUNT(*),0) AS cnt,
			COALESCE(SUM(price_usd),0) AS amount
		FROM cars
		WHERE status = 'sold'
	`).Scan(&sum.SoldCarsCount, &sum.SoldTotalAmount)
	if err != nil {
		return Summary{}, err
	}

	err = s.db.QueryRowContext(ctx, `
		SELECT COALESCE(COUNT(*),0)
		FROM cars
		WHERE status = 'available'
	`).Scan(&sum.AvailableCarsCount)
	if err != nil {
		return Summary{}, err
	}

	err = s.db.QueryRowContext(ctx, `
		SELECT COALESCE(COUNT(*),0)
		FROM cars
		WHERE status = 'in_transit'
	`).Scan(&sum.InTransitCarsCount)
	if err != nil {
		return Summary{}, err
	}

	err = s.db.QueryRowContext(ctx, `
		SELECT COALESCE(COUNT(*),0)
		FROM leads
	`).Scan(&sum.LeadsCount)
	if err != nil {
		sum.LeadsCount = 0
	}

	rows, err := s.db.QueryContext(ctx, `
		SELECT
			TO_CHAR(DATE_TRUNC('month', sold_at), 'YYYY-MM') AS month,
			COUNT(*) AS cnt,
			COALESCE(SUM(price_usd),0) AS amount
		FROM cars
		WHERE status='sold' AND sold_at IS NOT NULL
		GROUP BY 1
		ORDER BY 1 DESC
		LIMIT 12
	`)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var m SalesByMonth
			if e := rows.Scan(&m.Month, &m.Count, &m.Amount); e != nil {
				return Summary{}, e
			}
			sum.SalesByMonth = append(sum.SalesByMonth, m)
		}
	}

	return sum, nil
}

func withMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}
