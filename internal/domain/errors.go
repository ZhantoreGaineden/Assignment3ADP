package domain

import "errors"

var (
	ErrCarNotFound     = errors.New("car not found")
	ErrCarNotAvailable = errors.New("car is not available for booking")
)
