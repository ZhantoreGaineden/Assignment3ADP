package repository

import (
	"Assignment3ADP/internal/domain"
	"database/sql"
	"log"
	"time"
)

type PostgresRepo struct {
	DB *sql.DB
}

func NewPostgresRepo(db *sql.DB) *PostgresRepo {
	return &PostgresRepo{DB: db}
}

// --- ADMIN METHODS ---

func (r *PostgresRepo) CreateCar(c *domain.Car) error {
	query := `INSERT INTO cars (vin, make, model, price_usd, status, created_at) 
			  VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.DB.Exec(query, c.VIN, c.Make, c.Model, c.PriceUSD, c.Status, time.Now())
	return err
}

func (r *PostgresRepo) GetAllCars() ([]domain.Car, error) {
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status FROM cars")
}

func (r *PostgresRepo) GetCarsInTransit() ([]domain.Car, error) {
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status FROM cars WHERE status = 'transit'")
}

func (r *PostgresRepo) UpdatePrice(id int64, priceKZT float64) error {
	_, err := r.DB.Exec("UPDATE cars SET price_kzt = $1 WHERE id = $2", priceKZT, id)
	return err
}

func (r *PostgresRepo) DeleteCar(id int64) error {
	_, err := r.DB.Exec("DELETE FROM cars WHERE id = $1", id)
	return err
}

// --- CLIENT METHODS ---

func (r *PostgresRepo) GetAvailableCars() ([]domain.Car, error) {
	// Clients never see 'sold' or 'reserved' cars
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status FROM cars WHERE status IN ('available', 'transit')")
}

func (r *PostgresRepo) GetCarByID(id int64) (*domain.Car, error) {
	var c domain.Car
	query := "SELECT id, vin, make, model, price_usd, price_kzt, status FROM cars WHERE id = $1"
	err := r.DB.QueryRow(query, id).Scan(&c.ID, &c.VIN, &c.Make, &c.Model, &c.PriceUSD, &c.PriceKZT, &c.Status)
	if err == sql.ErrNoRows {
		return nil, domain.ErrCarNotFound
	}
	return &c, err
}

// BookCar uses a TRANSACTION to prevent race conditions
func (r *PostgresRepo) BookCar(carID int64, userID int64) error {
	// 1. Begin Transaction
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 2. LOCK ROW (SELECT FOR UPDATE)
	var status string
	err = tx.QueryRow("SELECT status FROM cars WHERE id = $1 FOR UPDATE", carID).Scan(&status)
	if err != nil {
		return err
	}

	if status != "available" && status != "transit" {
		return domain.ErrCarNotAvailable
	}

	// 3. Update Status
	_, err = tx.Exec("UPDATE cars SET status = 'reserved', user_id = $2 WHERE id = $1", userID, carID)
	if err != nil {
		return err
	}

	// 4. Commit
	log.Printf("[DB] Transaction Committed: Car %d reserved by User %d", carID, userID)
	return tx.Commit()
}

// Helper to avoid repeating scan logic
func (r *PostgresRepo) fetchCars(query string) ([]domain.Car, error) {
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cars []domain.Car
	for rows.Next() {
		var c domain.Car
		if err := rows.Scan(&c.ID, &c.VIN, &c.Make, &c.Model, &c.PriceUSD, &c.PriceKZT, &c.Status); err != nil {
			return nil, err
		}
		cars = append(cars, c)
	}
	return cars, nil
}
