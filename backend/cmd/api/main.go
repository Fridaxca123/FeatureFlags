// Package main is the entry point for the Feature Flags API server.
// It opens the SQLite database, wires repositories and handlers, configures
// CORS, and starts the Gin HTTP server.
package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/fridax/featureflags/internal/config"
	handlers "github.com/fridax/featureflags/internal/handlers"
	"github.com/fridax/featureflags/internal/repository"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

func main() {
	cfg := config.Load()

	// Open the SQLite database. SetMaxOpenConns(1) avoids "database is locked"
	// errors when multiple requests try to write at the same time.
	db, err := sql.Open("sqlite", cfg.DatabasePath)
	if err != nil {
		log.Fatalf("no se pudo abrir la base de datos: %v", err)
	}
	defer db.Close()
	db.SetMaxOpenConns(1)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	for _, pragma := range []string{
		"PRAGMA journal_mode = WAL;",
		"PRAGMA busy_timeout = 5000;",
		"PRAGMA foreign_keys = ON;",
	} {
		if _, err := db.ExecContext(ctx, pragma); err != nil {
			log.Fatalf("no se pudo configurar SQLite: %v", err)
		}
	}

	userRepo := repository.NewUserRepository(db)
	if err := userRepo.Migrate(ctx); err != nil {
		log.Fatalf("no se pudo migrar la base de datos: %v", err)
	}

	userHandler := handlers.NewUserHandler(userRepo)

	// Initialize a new Gin router with default middleware: logger and recovery middleware
	r := gin.Default()

	// Use the CORS middleware defined below
	r.Use(corsMiddleware(cfg.AllowedOrigins))

	// Define route handlers
	r.GET("/ping", handlers.Ping)
	r.GET("/pong", handlers.Pong)

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "ok",
				"message": "Feature Flags Lab API is running",
			})
		})
		api.GET("/users", userHandler.List)
		api.POST("/users", userHandler.Create)
	}

	// Run the server on the configured port (8082 by default)
	err = r.Run(":" + cfg.Port)
	if err != nil {
		panic(err)
	}
}

// corsMiddleware returns a CORS middleware handler. It checks the request
// Origin against the allowed origins and sets the appropriate headers.
// Preflight OPTIONS requests are handled with status 204.
func corsMiddleware(allowedOrigins []string) gin.HandlerFunc {
	isOriginAllowed := func(origin string, allowed []string) bool {
		for _, allowedOrigin := range allowed {
			if origin == allowedOrigin {
				return true
			}
		}
		return false
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		if isOriginAllowed(origin, allowedOrigins) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
			c.Writer.Header().Set("Vary", "Origin")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
