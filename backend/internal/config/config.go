// runtime configuration
package config

import (
	"os"
	"strings"
)

type Config struct {
	Port           string
	DatabasePath   string
	AllowedOrigins []string
}

func Load() Config {
	return Config{
		Port:         env("PORT", "8082"),
		DatabasePath: env("DB_PATH", "featureflags.db"),
		AllowedOrigins: splitAndTrim(
			env("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"),
		),
	}
}

func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func splitAndTrim(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if trimmed := strings.TrimSpace(part); trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
