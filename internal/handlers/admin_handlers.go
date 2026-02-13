package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

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

// UploadImage handles car image file uploads.
func (h *Handler) UploadImage(w http.ResponseWriter, r *http.Request) {
	// Limit upload size to 10MB
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("image")
	if err != nil {
		respondError(w, http.StatusBadRequest, "Error retrieving the file")
		return
	}
	defer file.Close()

	// Use UUID or timestamp for filename to avoid collisions
	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), handler.Filename)
	filePath := filepath.Join("uploads", filename)

	dst, err := os.Create(filePath)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Unable to create file on server")
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		respondError(w, http.StatusInternalServerError, "Error saving file")
		return
	}

	// Return the relative URL to the uploaded image
	respondJSON(w, http.StatusOK, map[string]string{
		"url": "/uploads/" + filename,
	})
}
