package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"Assignment3ADP/internal/handlers"
	"Assignment3ADP/internal/repository"
	"Assignment3ADP/internal/service"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// 1. Ensure uploads directory exists
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	// 2. Database Connection
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "")
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASS", "postgres")
	dbName := getEnv("DB_NAME", "postgres")
	dbSSL := getEnv("DB_SSL", "disable")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPass, dbName, dbSSL)

	log.Printf("Connecting to DB on %s:%s (DB: %s)", dbHost, dbPort, dbName)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}
	defer db.Close()

	// Verify connection
	if err := db.Ping(); err != nil {
		log.Printf("Warning: Database ping failed: %v. The app may fail on DB operations.", err)
	}

	repo := repository.NewPostgresRepo(db)
	adminService := service.NewAdminService(repo)
	clientService := service.NewClientService(repo)
	authService := service.NewAuthService(repo)

	// Start background worker
	go adminService.StartDailyCurrencyWorker()

	h := handlers.NewHandler(authService, adminService, clientService)
	mux := h.SetupRoutes()

	// CORS Middleware
	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		mux.ServeHTTP(w, r)
	})

	port := getEnv("APP_PORT", "8080")
	log.Printf("REST API Server started on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
