package service

import (
	"Assignment3ADP/internal/domain"
	"Assignment3ADP/internal/repository"
)

type ClientService struct {
	Repo repository.PostgresRepo
}

func NewClientService(repo repository.PostgresRepo) *ClientService {
	return &ClientService{Repo: repo}
}

// GetCatalog returns only cars that customers are allowed to buy
func (s *ClientService) GetCatalog() ([]domain.Car, error) {
	return s.Repo.GetAvailableCars()
}

// BookTestDrive handles the reservation safely
func (s *ClientService) BookTestDrive(carID int64, userID int64) error {

	car, err := s.Repo.GetCarByID(carID)
	if err != nil {
		return err
	}

	if car.Status != "available" && car.Status != "transit" {
		return domain.ErrCarNotAvailable
	}

	// 3. Perform Transaction
	return s.Repo.BookCar(carID, userID)
}
