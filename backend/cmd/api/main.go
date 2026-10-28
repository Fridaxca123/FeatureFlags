// Package main is the entry point for the Feature Flags API server.
// It sets up the Gin router, configures CORS middleware, and registers HTTP routes.
package main

import (
	// Import handlers package containing route handler functions
	handlers "github.com/fridax/featureflags/internal/handlers"
	"strings"

	// Import Gin framework for HTTP routing and middleware
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize a new Gin router with default middleware: logger and recovery middleware
	r := gin.Default()

	// Use the CORS middleware defined below
	r.Use(corsMiddleware())

	// Define route handlers
	r.GET("/ping", handlers.Ping)
	r.GET("/pong", handlers.Pong)

	// Run the server on port 8082
	err := r.Run(":" + "8082")
	if err != nil {
		panic(err)
	}
}

// corsMiddleware function definition creates and returns a CORS middleware handler.
// It handles cross-origin requests by checking allowed origins and setting appropriate headers.
// Preflight OPTIONS requests are handled with status 204.
func corsMiddleware() gin.HandlerFunc {
	// Define allowed origins as a comma-separated string
	// Add or modify origins as needed for different environments
	originsString := "https://example.com,https://test.com"
	var allowedOrigins []string
	if originsString != "" {
		// Split the originsString into individual origins and store them in allowedOrigins slice
		allowedOrigins = strings.Split(originsString, ",")
	}

	// Return the actual middleware handler function
	return func(c *gin.Context) {
		// Function to check if a given origin is allowed
		isOriginAllowed := func(origin string, allowedOrigins []string) bool {
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					return true
				}
			}
			return false
		}

		// Get the Origin header from the request
		origin := c.Request.Header.Get("Origin")

		// Check if the origin is allowed
		if isOriginAllowed(origin, allowedOrigins) {
			// If the origin is allowed, set CORS headers in the response
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		}

		// Handle preflight OPTIONS requests by aborting with status 204
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// Call the next handler
		c.Next()
	}
}
