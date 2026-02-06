package domain

import "time"

// Car represents a vehicle in the inventory.
type Car struct {
	ID        int64     `json:"id"`
	VIN       string    `json:"vin"`
	Make      string    `json:"make"`
	Model     string    `json:"model"`
	PriceUSD  float64   `json:"price_usd"`
	PriceKZT  float64   `json:"price_kzt"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
