package repository

import (
	"Assignment3ADP/internal/domain"
	"database/sql"
	"errors"
	"time"
)

type PostgresRepo struct {
	DB *sql.DB
}

func NewPostgresRepo(db *sql.DB) *PostgresRepo {
	return &PostgresRepo{DB: db}
}

// GetCarByID fetches a single car's details including the image.
func (r *PostgresRepo) GetCarByID(id string) (*domain.Car, error) {
	var c domain.Car
	query := "SELECT id, vin, make, model, price_usd, price_kzt, status, image_url FROM cars WHERE id = $1"

	var imgUrl sql.NullString

	err := r.DB.QueryRow(query, id).
		Scan(&c.ID, &c.VIN, &c.Make, &c.Model, &c.PriceUSD, &c.PriceKZT, &c.Status, &imgUrl)

	if err == sql.ErrNoRows {
		return nil, domain.ErrCarNotFound
	}

	if imgUrl.Valid {
		c.ImageURL = imgUrl.String
	}
	return &c, err
}

// UpdatePrice updates the calculated KZT price.
func (r *PostgresRepo) UpdatePrice(id string, priceKZT float64) error {
	_, err := r.DB.Exec("UPDATE cars SET price_kzt = $1 WHERE id = $2", priceKZT, id)
	return err
}

// BookCar performs a transaction to reserve a car.
func (r *PostgresRepo) BookCar(carID string, userID string) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var status string
	if err := tx.QueryRow("SELECT status FROM cars WHERE id = $1 FOR UPDATE", carID).Scan(&status); err != nil {
		return err
	}
	if status != "available" && status != "transit" {
		return domain.ErrCarNotAvailable
	}
	if _, err := tx.Exec("UPDATE cars SET status = 'reserved', user_id = $2 WHERE id = $1", userID, carID); err != nil {
		return err
	}
	return tx.Commit()
}

// GetUserByUsername returns pointer to domain.User
func (r *PostgresRepo) GetUserByUsername(username string) (*domain.User, error) {
	u := &domain.User{}
	query := "SELECT id, username, password_hash, role FROM users WHERE username = $1"
	err := r.DB.QueryRow(query, username).Scan(&u.ID, &u.Username, &u.Password, &u.Role)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	return u, err
}

// CreateUser creates new user
func (r *PostgresRepo) CreateUser(u *domain.User) error {
	_, err := r.DB.Exec("INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
		u.Username, u.Password, u.Role)
	return err
}

// CreateLead creates new lead
func (r *PostgresRepo) CreateLead(lead *domain.Lead) error {
	query := `INSERT INTO leads (car_model, customer_name, customer_phone, inquiry_type, status) 
			  VALUES ($1, $2, $3, $4, 'new')`
	_, err := r.DB.Exec(query, lead.CarModel, lead.CustomerName, lead.CustomerPhone, lead.InquiryType)
	return err
}

// GetAllLeads
func (r *PostgresRepo) GetAllLeads() ([]domain.Lead, error) {
	rows, err := r.DB.Query("SELECT id, car_model, customer_name, customer_phone, inquiry_type, status, created_at FROM leads ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leads []domain.Lead
	for rows.Next() {
		var l domain.Lead
		rows.Scan(&l.ID, &l.CarModel, &l.CustomerName, &l.CustomerPhone, &l.InquiryType, &l.Status, &l.CreatedAt)
		leads = append(leads, l)
	}
	return leads, nil
}

// CreateCar adds a new vehicle to the inventory (Updated with image_url).
func (r *PostgresRepo) CreateCar(c *domain.Car) error {
	query := `INSERT INTO cars (vin, make, model, price_usd, status, image_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.DB.Exec(query, c.VIN, c.Make, c.Model, c.PriceUSD, c.Status, c.ImageURL, time.Now())
	return err
}

// GetAllCars retrieves the full inventory.
func (r *PostgresRepo) GetAllCars() ([]domain.Car, error) {
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status, image_url FROM cars ORDER BY created_at DESC")
}

// GetAvailableCars retrieves only cars valid for customers to buy.
func (r *PostgresRepo) GetAvailableCars() ([]domain.Car, error) {
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status, image_url FROM cars WHERE status IN ('available', 'transit')")
}

// GetCarsInTransit finds cars that require currency updates.
func (r *PostgresRepo) GetCarsInTransit() ([]domain.Car, error) {
	return r.fetchCars("SELECT id, vin, make, model, price_usd, price_kzt, status, image_url FROM cars WHERE status = 'transit'")
}

// fetchCars helper updated to scan image_url.
func (r *PostgresRepo) fetchCars(query string) ([]domain.Car, error) {
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var cars []domain.Car
	for rows.Next() {
		var c domain.Car
		var imgUrl sql.NullString // Handle potential NULLs safely

		if err := rows.Scan(&c.ID, &c.VIN, &c.Make, &c.Model, &c.PriceUSD, &c.PriceKZT, &c.Status, &imgUrl); err != nil {
			return nil, err
		}
		if imgUrl.Valid {
			c.ImageURL = imgUrl.String
		}
		cars = append(cars, c)
	}
	return cars, nil
}

// DeleteCar removes a vehicle from the system.
func (r *PostgresRepo) DeleteCar(id string) error {
	_, err := r.DB.Exec("DELETE FROM cars WHERE id = $1", id)
	return err
}

// UpdateStatus changes the status of a vehicle.
func (r *PostgresRepo) UpdateStatus(id string, status string) error {
	_, err := r.DB.Exec("UPDATE cars SET status = $1 WHERE id = $2", status, id)
	return err
}
