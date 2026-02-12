package service

import (
	"Assignment3ADP/internal/domain"
)

type ClientService struct {
	Repo domain.Repository
}

func NewClientService(repo domain.Repository) *ClientService {
	return &ClientService{Repo: repo}
}

// GetCatalog returns only cars that customers are allowed to buy.
func (s *ClientService) GetCatalog() ([]domain.Car, error) {
	return s.Repo.GetAvailableCars()
}

// GetCarDetails fetches a specific car by its UUID.
func (s *ClientService) GetCarDetails(id string) (*domain.Car, error) {
	return s.Repo.GetCarByID(id)
}

// BookTestDrive handles the reservation logic.
func (s *ClientService) BookTestDrive(carID string, userID string) error {
	car, err := s.Repo.GetCarByID(carID)
	if err != nil {
		return err
	}

	if car.Status != "available" && car.Status != "transit" {
		return domain.ErrCarNotAvailable
	}

	return s.Repo.BookCar(carID, userID)
}
