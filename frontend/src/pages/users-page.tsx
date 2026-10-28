import { useEffect, useMemo, useState } from "react"
import {
  Loader2,
  Mail,
  RefreshCw,
  Search,
  UserPlus,
  Users,
} from "lucide-react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { CreateUserDialog } from "@/components/users/create-user-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  ApiError,
  formatUserDate,
  initials,
  listUsers,
  type User,
} from "@/lib/api"

const avatarColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
]

function avatarColor(id: number) {
  return avatarColors[id % avatarColors.length]
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    listUsers()
      .then((data) => {
        if (!cancelled) setUsers(data)
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(
            cause instanceof ApiError
              ? cause.message
              : "No se pudo conectar con el servidor"
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      setUsers(await listUsers())
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "No se pudo conectar con el servidor"
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter((user) =>
      [user.name, user.email].join(" ").toLowerCase().includes(term)
    )
  }, [users, query])

  function handleCreated(user: User) {
    setUsers((current) => [user, ...current])
    setError(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar className="hidden lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight">
              Clientes
            </h1>
          </div>

          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus />
            <span className="hidden sm:inline">Nuevo cliente</span>
          </Button>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar clientes..."
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={reload}
              disabled={loading}
              aria-label="Recargar"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <RefreshCw />
              )}
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={reload}>
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">Clientes</CardTitle>
              <Badge variant="secondary">
                {loading ? "—" : users.length}
              </Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <Skeleton className="size-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <Users className="size-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Sin clientes</p>
                  <p className="text-xs text-muted-foreground">
                    {users.length === 0
                      ? "Agrega el primer cliente"
                      : "Sin resultados"}
                  </p>
                  {users.length === 0 ? (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => setDialogOpen(true)}
                    >
                      <UserPlus />
                      Nuevo cliente
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="divide-y rounded-lg border">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3"
                    >
                      <Avatar className="size-9">
                        <AvatarFallback
                          className={cn(
                            "text-xs font-semibold text-white",
                            avatarColor(user.id)
                          )}
                        >
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {user.name}
                          </p>
                        </div>
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Mail className="size-3 shrink-0" />
                          {user.email}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatUserDate(user.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {dialogOpen ? (
        <CreateUserDialog
          open
          onOpenChange={setDialogOpen}
          onCreated={handleCreated}
        />
      ) : null}
    </div>
  )
}
