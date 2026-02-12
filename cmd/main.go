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
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASS", "postgres")
	dbName := getEnv("DB_NAME", "postgres")
	dbSSL := getEnv("DB_SSL", "disable")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPass, dbName, dbSSL)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}
	defer db.Close()

	repo := repository.NewPostgresRepo(db)
	adminService := service.NewAdminService(repo)
	clientService := service.NewClientService(repo)
	authService := service.NewAuthService(repo)

	// Start background worker
	go adminService.StartDailyCurrencyWorker()

	h := handlers.NewHandler(authService, adminService, clientService)
	mux := h.SetupRoutes()

	port := getEnv("APP_PORT", "8080")
	log.Printf("REST API Server started on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
