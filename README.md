# FeatureFlags

## Tech Stack

### Backend — Go

- Go: Statically typed, compiled programming language.
- Gin: Lightweight HTTP web framework for building APIs.
- net/http : Go's standard HTTP library.

### Frontend — TypeScript and React

- React: JavaScript library for building user interfaces.
- TypeScript: Statically typed superset of JavaScript.
- Vite: Frontend build tool and development server.
- React Router DOM: Library for client-side routing and navigation.
- Bun: JavaScript runtime and package manager.
- Oxlint: Fast JavaScript and TypeScript linter written in Rust.

### Architecture Overview

The application follows a client-server architecture. The React frontend, written in TypeScript, communicates with the Go backend through HTTP requests. Gin handles API routing and request processing, while Go's standard library provides the underlying HTTP functionality.

Vite powers the frontend development and production build workflows, while Bun manages JavaScript dependencies and scripts.