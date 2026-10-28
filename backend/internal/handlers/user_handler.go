package handlers

import (
	"errors"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/fridax/featureflags/internal/model"
	"github.com/fridax/featureflags/internal/repository"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// UserHandler exposes HTTP endpoints for user management.
type UserHandler struct {
	repo *repository.UserRepository
}

func NewUserHandler(repo *repository.UserRepository) *UserHandler {
	return &UserHandler{repo: repo}
}

type createUserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Create handles POST /api/users.
func (h *UserHandler) Create(c *gin.Context) {
	var req createUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	name := strings.TrimSpace(req.Name)
	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := req.Password

	if len(name) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El nombre debe tener al menos 2 caracteres"})
		return
	}
	if _, err := mail.ParseAddress(email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El correo electrónico no es válido"})
		return
	}
	if len(password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La contraseña debe tener al menos 8 caracteres"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo procesar la contraseña"})
		return
	}

	user := &model.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
	}

	if err := h.repo.Create(c.Request.Context(), user); err != nil {
		if errors.Is(err, repository.ErrEmailTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": "Ya existe un usuario con ese correo"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear el usuario"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// List handles GET /api/users.
func (h *UserHandler) List(c *gin.Context) {
	users, err := h.repo.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener los usuarios"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
