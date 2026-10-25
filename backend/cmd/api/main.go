package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Feature Flags Lab API is running",
		})
	})

	if err := router.Run(":8080"); err != nil {
		panic(err)
	}
}
