package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	godotenv.Load()

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPass, dbName)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	password := "password123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		log.Fatal(err)
	}

	query := `UPDATE users SET password_hash = $1 WHERE username = 'admin'`

	res, err := db.Exec(query, string(hashedPassword))
	if err != nil {
		log.Fatal(err)
	}

	count, _ := res.RowsAffected()
	if count == 0 {
		// If update failed, maybe user doesn't exist? Insert it.
		insertQuery := `INSERT INTO users (username, password_hash, role) VALUES ('admin', $1, 'admin')`
		_, err = db.Exec(insertQuery, string(hashedPassword))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Admin user created with password 'password123'")
	} else {
		fmt.Println("Admin password successfully reset to 'password123'")
	}

	// Verify
	var storedHash string
	err = db.QueryRow("SELECT password_hash FROM users WHERE username = 'admin'").Scan(&storedHash)
	if err != nil {
		log.Fatal(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password))
	if err != nil {
		fmt.Println("Verification FAILED: Stored hash does not match 'password123'")
	} else {
		fmt.Println("Verification SUCCESS: Database is now ready for login.")
	}
}
