export type TaskStatus = "todo" | "in_progress" | "review" | "done"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignee: {
    name: string
    initials: string
    color: string
  }
  tag: string
}

export const statusConfig: Record<
  TaskStatus,
  { label: string; dot: string; badge: string }
> = {
  todo: {
    label: "Por hacer",
    dot: "bg-slate-400",
    badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
  in_progress: {
    label: "En progreso",
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  review: {
    label: "En revisión",
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  done: {
    label: "Completada",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
}

export const priorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Baja",
    className:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  },
  medium: {
    label: "Media",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300",
  },
  high: {
    label: "Alta",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  },
  urgent: {
    label: "Urgente",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300",
  },
}

export const seedTasks: Task[] = [
  {
    id: "TASK-101",
    title: "Diseñar la pantalla de onboarding",
    description:
      "Crear los wireframes y el flujo de bienvenida para nuevos usuarios.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-30",
    assignee: { name: "Ana Torres", initials: "AT", color: "bg-violet-500" },
    tag: "Diseño",
  },
  {
    id: "TASK-102",
    title: "Configurar el pipeline de CI",
    description:
      "Automatizar tests y despliegues con GitHub Actions para el backend.",
    status: "todo",
    priority: "urgent",
    dueDate: "2026-10-27",
    assignee: { name: "Luis Ramos", initials: "LR", color: "bg-blue-500" },
    tag: "Infra",
  },
  {
    id: "TASK-103",
    title: "Implementar autenticación con JWT",
    description:
      "Login, registro y refresco de tokens en el API de Go con Gin.",
    status: "review",
    priority: "high",
    dueDate: "2026-10-29",
    assignee: { name: "Marta Gil", initials: "MG", color: "bg-emerald-500" },
    tag: "Backend",
  },
  {
    id: "TASK-104",
    title: "Documentar los endpoints de la API",
    description: "Añadir ejemplos de request/response en el README.",
    status: "done",
    priority: "low",
    dueDate: "2026-10-24",
    assignee: { name: "Diego Paz", initials: "DP", color: "bg-amber-500" },
    tag: "Docs",
  },
  {
    id: "TASK-105",
    title: "Añadir tests de evaluación de flags",
    description:
      "Cubrir los casos de segmentación por usuario y porcentaje de rollout.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-11-02",
    assignee: { name: "Sofía Ruiz", initials: "SR", color: "bg-rose-500" },
    tag: "Testing",
  },
  {
    id: "TASK-106",
    title: "Refactorizar el layout del sidebar",
    description: "Extraer la navegación a componentes reutilizables.",
    status: "todo",
    priority: "low",
    dueDate: "2026-11-05",
    assignee: { name: "Ana Torres", initials: "AT", color: "bg-violet-500" },
    tag: "Frontend",
  },
  {
    id: "TASK-107",
    title: "Revisar accesibilidad del dashboard",
    description:
      "Comprobar contraste, navegación por teclado y etiquetas ARIA.",
    status: "done",
    priority: "medium",
    dueDate: "2026-10-22",
    assignee: { name: "Marta Gil", initials: "MG", color: "bg-emerald-500" },
    tag: "QA",
  },
]

export const currentUser = {
  name: "Frida Cárdenas",
  initials: "FC",
  role: "Product Manager",
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T12:00:00`))
}

export function isOverdue(task: Task) {
  if (task.status === "done") return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${task.dueDate}T00:00:00`) < today
}
