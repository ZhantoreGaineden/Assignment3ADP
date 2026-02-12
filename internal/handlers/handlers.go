package handlers

import (
	"Assignment3ADP/internal/domain"
	"Assignment3ADP/internal/middleware"
	"Assignment3ADP/internal/service"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

type Handler struct {
	AuthService   *service.AuthService
	AdminService  *service.AdminService
	ClientService *service.ClientService
}

func NewHandler(auth *service.AuthService, admin *service.AdminService, client *service.ClientService) *Handler {
	return &Handler{
		AuthService:   auth,
		AdminService:  admin,
		ClientService: client,
	}
}

// SetupRoutes defines the REST API endpoints.
func (h *Handler) SetupRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	// Public Routes
	mux.HandleFunc("GET /api/cars", h.GetCatalog)
	mux.HandleFunc("GET /api/cars/", h.GetCarDetails) // Matches /api/cars/{id}
	mux.HandleFunc("POST /api/login", h.Login)
	mux.HandleFunc("POST /api/leads", h.CreateLead)

	// Protected Routes (Admin/Manager)
	mux.HandleFunc("GET /api/admin/dashboard", middleware.AuthMiddleware(h.GetAdminDashboard))
	mux.HandleFunc("POST /api/admin/cars", middleware.AuthMiddleware(h.CreateCar))

	return mux
}

// JSON Helper
func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

// GetCatalog returns the list of available cars.
func (h *Handler) GetCatalog(w http.ResponseWriter, r *http.Request) {
	cars, err := h.ClientService.GetCatalog()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to fetch catalog")
		return
	}

	var safeCars []domain.PublicCar
	for _, c := range cars {
		safeCars = append(safeCars, domain.PublicCar{
			ID:       c.ID,
			Make:     c.Make,
			Model:    c.Model,
			PriceUSD: c.PriceUSD,
			Status:   c.Status,
			ImageURL: c.ImageURL,
		})
	}

	respondJSON(w, http.StatusOK, safeCars)
}

// GetCarDetails returns a single car by UUID.
func (h *Handler) GetCarDetails(w http.ResponseWriter, r *http.Request) {
	prefix := "/api/cars/"
	id := r.URL.Path[len(prefix):]

	if id == "" {
		respondError(w, http.StatusBadRequest, "Missing car ID")
		return
	}

	car, err := h.ClientService.GetCarDetails(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "Car not found")
		return
	}

	respondJSON(w, http.StatusOK, car)
}

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
		respondError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	claims := jwt.MapClaims{
		"username": user.Username,
		"role":     user.Role,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Could not generate token")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{
		"token":   tokenString,
		"expires": time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	})
}

// GetAdminDashboard returns inventory and leads for admins.
func (h *Handler) GetAdminDashboard(w http.ResponseWriter, r *http.Request) {
	cars, err := h.AdminService.GetAllInventory()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "DB Error")
		return
	}

	leads, err := h.AdminService.Repo.GetAllLeads()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "DB Error")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"inventory": cars,
		"leads":     leads,
	})
}

// CreateCar adds a new car to the inventory.
func (h *Handler) CreateCar(w http.ResponseWriter, r *http.Request) {
	var req struct {
		VIN      string  `json:"vin"`
		Model    string  `json:"model"`
		ImageURL string  `json:"image_url"`
		Price    float64 `json:"price"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	if req.VIN == "" || req.Model == "" || req.Price <= 0 {
		respondError(w, http.StatusBadRequest, "VIN, Model, and positive Price are required")
		return
	}

	if err := h.AdminService.CreateCar(req.VIN, req.Model, req.ImageURL, req.Price); err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]string{
		"status":  "success",
		"message": "Car added to inventory",
	})
}

// CreateLead handles customer inquiries.
func (h *Handler) CreateLead(w http.ResponseWriter, r *http.Request) {
	var req struct {
		CarModel string `json:"car_model"`
		Name     string `json:"name"`
		Phone    string `json:"phone"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	lead := &domain.Lead{
		CarModel:      req.CarModel,
		CustomerName:  req.Name,
		CustomerPhone: req.Phone,
		InquiryType:   "test_drive",
	}

	if err := h.AdminService.Repo.CreateLead(lead); err != nil {
		respondError(w, http.StatusInternalServerError, "Database error")
		return
	}

	respondJSON(w, http.StatusCreated, map[string]string{
		"status":  "success",
		"message": "Inquiry received",
	})
}
