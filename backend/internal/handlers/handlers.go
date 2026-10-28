package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Ping is a simple health/check endpoint handler that responds with a "ping" message.
func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "ping",
	})
}

// Pong is a simple health/check endpoint handler that responds with a "pong" message.
func Pong(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
