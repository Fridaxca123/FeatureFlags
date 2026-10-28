import { useState } from "react"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, createUser, type User } from "@/lib/api"

type CreateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (user: User) => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateUserDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function reset() {
    setName("")
    setEmail("")
    setPassword("")
    setError(null)
    setShowPassword(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError("Name has to have at leat 2 characters")
      return
    }
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email")
      return
    }
    if (password.length < 8) {
      setError("Password must be 8 charachters long")
      return
    }

    setSubmitting(true)
    try {
      const user = await createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })
      onCreated(user)
      handleOpenChange(false)
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Lost connection with the server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Crea una cuenta con nombre, correo y contraseña.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="user-name">Full name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Frida Cárdenas"
              autoFocus
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email">email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="frida@example.com"
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-password">Password</Label>
            <div className="relative">
              <Input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="pr-9"
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserPlus />
              )}
              {submitting ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
