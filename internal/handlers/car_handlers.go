package handlers

import (
	"Assignment3ADP/internal/domain"
	"encoding/json"
	"net/http"
)

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

// DeleteCar handles vehicle removal.
func (h *Handler) DeleteCar(w http.ResponseWriter, r *http.Request) {
	prefix := "/api/admin/cars/"
	id := r.URL.Path[len(prefix):]

	if id == "" {
		respondError(w, http.StatusBadRequest, "Missing car ID")
		return
	}

	if err := h.AdminService.DeleteCar(id); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to delete car")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// UpdateStatus handles status changes for a vehicle.
func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID     string `json:"id"`
		Status string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	if err := h.AdminService.UpdateStatus(req.ID, req.Status); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to update status")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"status": "updated"})
}
