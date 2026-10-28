const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8082"

export type User = {
  id: number
  name: string
  email: string
  created_at: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
}

export class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      "No se pudo completar la solicitud"
    throw new ApiError(message)
  }

  return data as T
}

export async function listUsers(): Promise<User[]> {
  const data = await request<{ users: User[] }>("/api/users")
  return data.users
}

export async function createUser(input: CreateUserInput): Promise<User> {
  return request<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatUserDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
