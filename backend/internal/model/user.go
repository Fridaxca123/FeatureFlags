package model

// User represents an application user stored in SQLite.
// PasswordHash is never serialized to JSON.
type User struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
	CreatedAt    string `json:"created_at"`
}
