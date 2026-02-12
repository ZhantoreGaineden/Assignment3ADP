package domain

import "time"

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`
	Role     string `json:"role"`
}

type Lead struct {
	ID            string    `json:"id"`
	CarModel      string    `json:"car_model"`
	CustomerName  string    `json:"customer_name"`
	CustomerPhone string    `json:"customer_phone"`
	InquiryType   string    `json:"inquiry_type"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
}

type Car struct {
	ID        string    `json:"id"`
	VIN       string    `json:"vin"`
	Make      string    `json:"make"`
	Model     string    `json:"model"`
	PriceUSD  float64   `json:"price_usd"`
	PriceKZT  float64   `json:"price_kzt"`
	Status    string    `json:"status"`
	ImageURL  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
}

type PublicCar struct {
	ID       string
	Make     string
	Model    string
	PriceUSD float64
	Status   string
	ImageURL string
}

type Repository interface {
	CreateUser(u *User) error
	GetUserByUsername(username string) (*User, error)
	CreateLead(lead *Lead) error
	GetAllLeads() ([]Lead, error)
	CreateCar(c *Car) error
	GetAllCars() ([]Car, error)
	GetAvailableCars() ([]Car, error)
	GetCarByID(id string) (*Car, error)
	GetCarsInTransit() ([]Car, error)
	UpdatePrice(id string, priceKZT float64) error
	BookCar(carID string, userID string) error
}
