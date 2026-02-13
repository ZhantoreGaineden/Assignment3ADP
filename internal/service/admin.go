package service

import (
	"Assignment3ADP/internal/domain"
	"errors"
)

type AdminService struct {
	Repo domain.Repository
}

func NewAdminService(repo domain.Repository) *AdminService {
	return &AdminService{Repo: repo}
}

// CreateCar now accepts imageURL.
func (s *AdminService) CreateCar(vin, model, imageURL string, priceUSD float64) error {
	if priceUSD <= 0 {
		return errors.New("price must be positive")
	}

	newCar := &domain.Car{
		VIN:      vin,
		Model:    model,
		PriceUSD: priceUSD,
		Status:   "transit",
		ImageURL: imageURL, // Set the URL
	}

	return s.Repo.CreateCar(newCar)
}

// UpdatePrice updates car price by id
func (s *AdminService) UpdatePrice(id string, newPriceKZT float64) error {
	return s.Repo.UpdatePrice(id, newPriceKZT)
}

func (s *AdminService) GetAllInventory() ([]domain.Car, error) {
	return s.Repo.GetAllCars()
}

func (s *AdminService) DeleteCar(id string) error {
	return s.Repo.DeleteCar(id)
}

func (s *AdminService) UpdateStatus(id string, status string) error {
	return s.Repo.UpdateStatus(id, status)
}
