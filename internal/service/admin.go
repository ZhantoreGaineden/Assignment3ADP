package service

import (
	"Assignment3ADP/internal/domain"
	"Assignment3ADP/internal/repository"
	"errors"
)

type AdminService struct {
	Repo repository.PostgresRepo
}

func NewAdminService(repo repository.PostgresRepo) *AdminService {
	return &AdminService{Repo: repo}
}

// CreateCar Only Admins can add new inventory
func (s *AdminService) CreateCar(vin, model string, priceUSD float64) error {
	if priceUSD <= 0 {
		return errors.New("price must be positive")
	}

	newCar := &domain.Car{
		VIN:      vin,
		Model:    model,
		PriceUSD: priceUSD,
		Status:   "transit",
	}

	return s.Repo.CreateCar(newCar)
}

// UpdatePrice Only Admins can change prices
func (s *AdminService) UpdatePrice(id int64, newPriceKZT float64) error {
	return s.Repo.UpdatePrice(id, newPriceKZT)
}

// GetAllInventory Admins see EVERYTHING (Sold, Reserved, In-Transit)
func (s *AdminService) GetAllInventory() ([]domain.Car, error) {
	return s.Repo.GetAllCars()
}
