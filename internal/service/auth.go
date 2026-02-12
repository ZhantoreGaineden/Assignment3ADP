package service

import (
	"Assignment3ADP/internal/domain"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

// AuthService handles secure login and registration.
type AuthService struct {
	Repo domain.Repository
}

func NewAuthService(repo domain.Repository) *AuthService {
	return &AuthService{Repo: repo}
}

// Register hashes the password using Bcrypt before saving.
func (s *AuthService) Register(username, password, role string) error {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	user := &domain.User{
		Username: username,
		Password: string(hashedBytes),
		Role:     role,
	}
	return s.Repo.CreateUser(user)
}

// Login compares the provided password with the stored hash.
func (s *AuthService) Login(username, password string) (*domain.User, error) {
	user, err := s.Repo.GetUserByUsername(username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Securely compare the hash
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}
