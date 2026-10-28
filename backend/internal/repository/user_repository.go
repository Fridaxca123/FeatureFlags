package repository

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/fridax/featureflags/internal/model"
)

// ErrEmailTaken is returned when a user tries to register with an existing email.
var ErrEmailTaken = errors.New("email already registered")

// UserRepository handles persistence for users in SQLite.
type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Migrate creates the users table and indexes if they do not exist yet.
func (r *UserRepository) Migrate(ctx context.Context) error {
	const createTable = `
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TEXT NOT NULL
);`
	if _, err := r.db.ExecContext(ctx, createTable); err != nil {
		return err
	}

	_, err := r.db.ExecContext(
		ctx,
		`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (lower(email));`,
	)
	return err
}

// Create inserts a new user and fills in its generated ID.
func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
	result, err := r.db.ExecContext(
		ctx,
		`INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)`,
		user.Name,
		strings.ToLower(user.Email),
		user.PasswordHash,
		user.CreatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return ErrEmailTaken
		}
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	user.ID = id
	return nil
}

// List returns every user ordered by creation date (newest first).
func (r *UserRepository) List(ctx context.Context) ([]model.User, error) {
	rows, err := r.db.QueryContext(
		ctx,
		`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC, id DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]model.User, 0)
	for rows.Next() {
		var user model.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, rows.Err()
}

// Count returns the total number of users.
func (r *UserRepository) Count(ctx context.Context) (int, error) {
	var total int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&total)
	return total, err
}
