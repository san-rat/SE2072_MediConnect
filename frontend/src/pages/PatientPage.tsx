import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, Heart, AlertCircle, CheckCircle, Check, Filter } from "lucide-react"
import { toast } from "sonner"
import { notificationService } from "../services/notificationService"
import Header from "../components/Header"

type NotifType = "appointment" | "health-awareness" | "urgent" | "general"
type Priority = "low" | "normal" | "high" | "urgent"

interface Notification {
  id: string
  message: string
  type: NotifType
  priority: Priority
  timestamp: string
  isRead: boolean
}

export default function PatientPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | NotifType>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { void fetchNotifications() }, [])

  async function fetchNotifications() {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch notifications")
    } finally {
      setIsLoading(false)
    }
  }

  async function markAsRead(id: string) {
    // optimistic
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)))
    try {
      await notificationService.markAsRead(id)
      toast.success("Notification marked as read")
    } catch {
      // roll back if failed
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: false } : n)))
      toast.error("Error updating notification")
    }
  }

  const filtered = useMemo(() => {
    if (filter === "all") return notifications
    if (filter === "unread") return notifications.filter(n => !n.isRead)
    return notifications.filter(n => n.type === filter)
  }, [notifications, filter])

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showLogin={false} />

      <main className="container-pro py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="mc-heading mb-4 text-3xl">Your Health Notifications</h2>
            <p className="mc-subheading mx-auto max-w-2xl">
              Stay informed about your appointments, health updates, and important medical communications.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Filter notifications:</span>
              </div>
              <Select value={filter} onValueChange={(v: string) => setFilter(v as typeof filter)}>
                <SelectTrigger className="select-trigger w-56">
                  <SelectValue placeholder="All notifications" />
                </SelectTrigger>
                <SelectContent className="dropdown-content bg-popover text-popover-foreground border border-border shadow-[0_12px_40px_rgba(2,44,55,0.10)]">
                  <SelectItem value="all" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">All Notifications</SelectItem>
                  <SelectItem value="unread" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">Unread Only</SelectItem>
                  <SelectItem value="appointment" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">Appointments</SelectItem>
                  <SelectItem value="health-awareness" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">Health Awareness</SelectItem>
                  <SelectItem value="urgent" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">Urgent Updates</SelectItem>
                  <SelectItem value="general" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">General Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {unreadCount > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Unread notifications</div>
                <div className="text-2xl font-bold text-primary">{unreadCount}</div>
              </div>
            )}
          </div>

          {isLoading ? (
            <SkeletonList />
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="space-y-6">
              {filtered.map((n) => (
                <NotificationCard key={n.id} n={n} onRead={() => markAsRead(n.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

/* ---------------- helpers/components ---------------- */

function TypeIcon({ t }: { t: NotifType }) {
  switch (t) {
    case "appointment": return <Calendar className="h-4 w-4" />
    case "health-awareness": return <Heart className="h-4 w-4" />
    case "urgent": return <AlertCircle className="h-4 w-4" />
    default: return <CheckCircle className="h-4 w-4" />
  }
}

function Chip({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <span className={`badge ${className}`}>{children}</span>
}

function NotificationCard({ n, onRead }: { n: Notification; onRead: () => void }) {
  const typeChip =
    n.type === "appointment"
      ? "text-primary bg-muted"
      : n.type === "health-awareness"
      ? "text-emerald-600 bg-emerald-50"
      : "text-slate-600 bg-slate-100"

  const priorityChip =
    n.priority === "high"
      ? "text-amber-700 bg-amber-50"
      : n.priority === "urgent"
      ? "text-red-600 bg-red-50"
      : "text-slate-600 bg-slate-100"

  return (
    <Card
      className={`border border-border rounded-xl bg-card text-card-foreground shadow-[0_8px_30px_rgba(2,44,55,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(2,44,55,0.08)] ${
        !n.isRead ? "ring-2 ring-[rgb(var(--color-ring))]/40 bg-muted/60" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div
                className={`grid h-8 w-8 place-items-center rounded-lg ${
                  n.type === "urgent"
                    ? "text-red-600 bg-red-50"
                    : n.type === "appointment"
                    ? "text-primary bg-muted"
                    : n.type === "health-awareness"
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-600 bg-slate-100"
                }`}
              >
                <TypeIcon t={n.type as NotifType} />
              </div>

              <div className="flex items-center gap-2">
                <Chip className={typeChip}>{n.type.replace("-", " ")}</Chip>
                <Chip className={priorityChip}>{n.priority} priority</Chip>
                {!n.isRead && <Chip className="text-blue-700 bg-blue-100">New</Chip>}
              </div>
            </div>

            <p className="mb-3 leading-relaxed text-[rgb(31,41,55)]">{n.message}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(n.timestamp).toLocaleString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {!n.isRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRead}
              className="btn btn-outline shrink-0"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-border">
          <CardContent className="p-6">
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <Card className="border border-border">
      <CardContent className="p-12 text-center">
        <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">No notifications found</h3>
        <p className="text-muted-foreground">
          {filter === "all" ? "You don't have any notifications yet." : `No ${filter} notifications found.`}
        </p>
      </CardContent>
    </Card>
  )
}
