package domain

import "errors"

var (
	ErrCarNotFound     = errors.New("car not found")
	ErrCarNotAvailable = errors.New("car is not available for booking")
	ErrInvalidPrice    = errors.New("price must be positive")
	ErrDBInternal      = errors.New("internal database error")
)
