package handlers

import (
	"Assignment3ADP/internal/domain"
	"encoding/json"
	"net/http"
)

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
