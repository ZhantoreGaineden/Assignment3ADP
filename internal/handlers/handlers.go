package handlers

import (
	"Assignment3ADP/internal/middleware"
	"Assignment3ADP/internal/service"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
)

type Handler struct {
	AuthService   *service.AuthService
	AdminService  *service.AdminService
	ClientService *service.ClientService
	jwtKey        []byte
}

func NewHandler(auth *service.AuthService, admin *service.AdminService, client *service.ClientService) *Handler {
	return &Handler{
		AuthService:   auth,
		AdminService:  admin,
		ClientService: client,
		jwtKey:        []byte(os.Getenv("JWT_SECRET")),
	}
}

// SetupRoutes defines the REST API endpoints.
func (h *Handler) SetupRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	// Public Routes
	mux.HandleFunc("GET /api/cars", h.GetCatalog)
	mux.HandleFunc("GET /api/cars/", h.GetCarDetails) // Matches /api/cars/{id}
	mux.HandleFunc("POST /api/login", h.Login)
	mux.HandleFunc("POST /api/register", h.Register)
	mux.HandleFunc("POST /api/leads", h.CreateLead)

	// Protected Routes (Admin/Manager)
	mux.HandleFunc("GET /api/admin/dashboard", middleware.AuthMiddleware(h.GetAdminDashboard))
	mux.HandleFunc("POST /api/admin/cars", middleware.AuthMiddleware(h.CreateCar))
	mux.HandleFunc("POST /api/admin/upload", middleware.AuthMiddleware(h.UploadImage))
	mux.HandleFunc("DELETE /api/admin/cars/", middleware.AuthMiddleware(h.DeleteCar))
	mux.HandleFunc("PUT /api/admin/cars/status", middleware.AuthMiddleware(h.UpdateStatus))

	// Static Files for Uploads
	fs := http.FileServer(http.Dir("uploads"))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	// Serve Frontend SPA
	frontendDist := "frontend/dist"
	if _, err := os.Stat(frontendDist); err == nil {
		mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := filepath.Join(frontendDist, r.URL.Path)
			if _, err := os.Stat(path); os.IsNotExist(err) {
				// If file doesn't exist, serve index.html for React Router
				http.ServeFile(w, r, filepath.Join(frontendDist, "index.html"))
				return
			}
			http.FileServer(http.Dir(frontendDist)).ServeHTTP(w, r)
		}))
	}

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
