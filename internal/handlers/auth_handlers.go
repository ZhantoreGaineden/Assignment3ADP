package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Login authenticates a user and returns a JWT.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := h.AuthService.Login(creds.Username, creds.Password)
	if err != nil {
		log.Printf("[DEBUG] Login failed for user '%s' (password length: %d): %v", creds.Username, len(creds.Password), err)
		respondError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}
	log.Printf("[DEBUG] Login successful for user '%s'", creds.Username)

	claims := jwt.MapClaims{
		"username": user.Username,
		"role":     user.Role,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(h.jwtKey)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Could not generate token")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{
		"token":   tokenString,
		"expires": time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	})
}

// Register creates a new user account.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(creds.Password) < 6 {
		respondError(w, http.StatusBadRequest, "Password must be at least 6 characters")
		return
	}

	// Default role is 'user'
	if err := h.AuthService.Register(creds.Username, creds.Password, "user"); err != nil {
		log.Printf("Registration failed for user '%s': %v", creds.Username, err)
		respondError(w, http.StatusConflict, "Username already taken or invalid") // Assuming conflict if it fails mostly
		return
	}

	respondJSON(w, http.StatusCreated, map[string]string{
		"message": "User registered successfully",
	})
}
