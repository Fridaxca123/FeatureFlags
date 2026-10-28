import { LayoutDashboard, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function AppSidebar({ className }: { className?: string }) {
  const { pathname } = useLocation()

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Clientes", icon: Users, href: "/usuarios" },
  ]

  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r bg-muted/40",
        className
      )}
    >
      <div className="flex h-14 items-center px-4">
        <span className="text-sm font-semibold tracking-tight">FeatureFlags</span>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
