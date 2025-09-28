import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Bell,
  Calendar,
  Heart,
  AlertCircle,
  CheckCircle,
  Check,
  Filter,
  Megaphone,
} from "lucide-react"
import { toast } from "sonner"
import { notificationService } from "../services/notificationService"
import { alertService } from "../services/alertService"
import Header from "../components/Header"
import type { NotifType, Priority, AlertType } from "../services/types"
import type { Notification } from "../services/notificationService";
import type { Alert } from "../services/alertService";


type UnifiedItem = {
  id: string
  message: string
  type: NotifType | AlertType
  priority?: Priority
  timestamp: string
  isRead?: boolean
  source: "notification" | "alert"
}

export default function PatientPage() {
  const [items, setItems] = useState<UnifiedItem[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "notification" | "alert">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const userId = 1; // TODO: replace with real logged-in user ID
      const [notifData, alertData] = await Promise.all([
        notificationService.getNotifications(userId),
        alertService.getAlerts(),
      ]);

      const formattedAlerts: UnifiedItem[] = (alertData as Alert[]).map((a) => ({
        id: a.id.toString(),
        message: `${a.title}: ${a.description}`,
        // Alerts do not carry a type from backend; set a constant to drive icon/color
        type: "health_camp" as AlertType,
        timestamp: a.eventDate || a.createdAt || new Date().toISOString(),
        source: "alert",
      }));

      const formattedNotifs: UnifiedItem[] = notifData.map((n: Notification) => ({
        id: n.id.toString(),  // keep consistent type
        message: n.message,
        // Normalize possible hyphen/underscore drift
        type: (n.type as string)?.replace("-", "_") as NotifType,
        // Backend uses createdAt; map to timestamp
        timestamp: (n as any).createdAt || (n as any).timestamp || new Date().toISOString(),
        isRead: n.isRead,
        source: "notification",
      }));

      setItems([...formattedAlerts, ...formattedNotifs].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications or alerts");
    } finally {
      setIsLoading(false);
    }
  }



  async function markAsRead(id: string) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, isRead: true } : i)))
    try {
      await notificationService.markAsRead(Number(id))
      toast.success("Notification marked as read")
    } catch {
      setItems(prev => prev.map(i => (i.id === id ? { ...i, isRead: false } : i)))
      toast.error("Error updating read status")
    }
  }

  const filtered = useMemo(() => {
    switch (filter) {
      case "unread":
        return items.filter(i => i.source === "notification" && !i.isRead)
      case "notification":
        return items.filter(i => i.source === "notification")
      case "alert":
        return items.filter(i => i.source === "alert")
      default:
        return items
    }
  }, [items, filter])

  const unreadCount = useMemo(() => items.filter(i => i.source === "notification" && !i.isRead).length, [items])

  return (
      <div className="min-h-screen bg-background text-foreground">
        <Header showLogin={false} />
        <main className="container-pro py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="mc-heading mb-4 text-3xl">Your Health Updates</h2>
              <p className="mc-subheading mx-auto max-w-2xl">
                Stay informed with the latest notifications and health alerts tailored for you.
              </p>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Filter:</span>
                </div>
                <Select value={filter} onValueChange={(v: string) => setFilter(v as typeof filter)}>
                  <SelectTrigger className="select-trigger w-56">
                    <SelectValue placeholder="All items" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content bg-popover text-popover-foreground border border-border shadow-[0_12px_40px_rgba(2,44,55,0.10)]">
                    <SelectItem value="all">All Updates</SelectItem>
                    <SelectItem value="notification">Notifications Only</SelectItem>
                    <SelectItem value="alert">Health Alerts Only</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
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
                  {filtered.map((i) => (
                      <UnifiedCard key={i.id} item={i} onRead={() => markAsRead(i.id)} />
                  ))}
                </div>
            )}
          </div>
        </main>
      </div>
  )
}

/* ---------------- Components ---------------- */

function TypeIcon({ t, source }: { t: string; source: string }) {
  if (source === "alert") return <Megaphone className="h-4 w-4" />
  switch (t) {
    case "appointment": return <Calendar className="h-4 w-4" />
    case "health_awareness": return <Heart className="h-4 w-4" />
    case "urgent": return <AlertCircle className="h-4 w-4" />
    default: return <CheckCircle className="h-4 w-4" />
  }
}

function Chip({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <span className={`badge ${className}`}>{children}</span>
}

function UnifiedCard({ item, onRead }: { item: UnifiedItem; onRead: () => void }) {
  const color =
      item.source === "alert"
          ? "text-pink-700 bg-pink-50"
          : item.type === "urgent"
              ? "text-red-600 bg-red-50"
              : item.type === "appointment"
                  ? "text-primary bg-muted"
                  : item.type === "health_awareness"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 bg-slate-100"

  return (
      <Card
          className={`border border-border rounded-xl bg-card text-card-foreground shadow-[0_8px_30px_rgba(2,44,55,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(2,44,55,0.08)] ${
              !item.isRead && item.source === "notification" ? "ring-2 ring-[rgb(var(--color-ring))]/40 bg-muted/60" : ""
          }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}>
                  <TypeIcon t={item.type} source={item.source} />
                </div>

                <div className="flex items-center gap-2">
                  <Chip className={color}>
                    {item.source === "alert" ? "Health Alert" : item.type.replace(/[_-]/g, " ")}
                  </Chip>
                  {item.priority && (
                      <Chip
                          className={
                            item.priority === "urgent"
                                ? "text-red-600 bg-red-50"
                                : item.priority === "high"
                                    ? "text-amber-700 bg-amber-50"
                                    : "text-slate-600 bg-slate-100"
                          }
                      >
                        {item.priority} priority
                      </Chip>
                  )}
                  {!item.isRead && item.source === "notification" && (
                      <Chip className="text-blue-700 bg-blue-100">New</Chip>
                  )}
                </div>
              </div>

              <p className="mb-3 leading-relaxed text-[rgb(31,41,55)]">{item.message}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(item.timestamp).toLocaleString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {item.source === "notification" && !item.isRead && (
                <Button variant="outline" size="sm" onClick={onRead}>
                  <Check className="mr-2 h-4 w-4" /> Mark as Read
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
          <h3 className="mb-2 text-lg font-medium">No items found</h3>
          <p className="text-muted-foreground">
            {filter === "all"
                ? "You don't have any notifications or alerts yet."
                : `No ${filter} items found.`}
          </p>
        </CardContent>
      </Card>
  )
}
