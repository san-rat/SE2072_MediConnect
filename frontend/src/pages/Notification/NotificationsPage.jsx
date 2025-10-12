import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Bell, Calendar, Heart, AlertCircle, CheckCircle, Check, Filter, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { notificationService } from "@/services/notificationService.js";
import { alertService } from "@/services/alertService.js";
import useCurrentUser from "@/hooks/useCurrentUser";
import "./NotificationPagePatient.css";

export default function NotificationsPage() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    //  use real logged-in user
    const { user, loadingUser } = useCurrentUser();

    // fetch when the user finishes loading
    useEffect(() => {
        if (loadingUser) return;
        if (!user?.id) {
            setItems([]);
            setIsLoading(false);
            return;
        }
        fetchAll(user.id);
    }, [loadingUser, user?.id]);

    async function fetchAll(userId) {
        setIsLoading(true);
        try {
            const [notifData, alertData] = await Promise.all([
                notificationService.getNotifications(userId), // -> GET /api/notifications/by-user/:userId
                alertService.getAlerts(),                    // -> GET /api/alerts
            ]);

            const formattedAlerts = (alertData ?? []).map((a) => ({
                id: String(a.id),
                message: `${a.title}: ${a.description}`,
                type: String(a.type || "health_camp").toLowerCase().replace(/-/g, "_"),
                timestamp: a.eventDate || a.createdAt || new Date().toISOString(),
                source: "alert",
            }));

            const formattedNotifs = (notifData ?? []).map((n) => ({
                id: String(n.id),
                title: n.title,
                message: n.message,
                // normalize enum/string for styling & icons
                type: String(n.type || "general").toLowerCase().replace(/-/g, "_"),
                // optional priority if backend returns it (low | normal | high | urgent)
                priority: n.priority ? String(n.priority).toLowerCase() : undefined,
                timestamp: n.createdAt || n.timestamp || new Date().toISOString(),
                isRead: Boolean(n.isRead),
                source: "notification",
            }));

            setItems(
                [...formattedAlerts, ...formattedNotifs].sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                )
            );
        } catch (err) {
            console.error("[NotificationsPage] fetchAll error:", err);
            toast.error("Failed to load notifications or alerts");
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function markAsRead(id) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)));
        try {
            await notificationService.markAsRead(Number(id)); // PUT /api/notifications/{id}/read
            toast.success("Notification marked as read");
        } catch {
            setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: false } : i)));
            toast.error("Error updating read status");
        }
    }

    const filtered = useMemo(() => {
        switch (filter) {
            case "unread":
                return items.filter((i) => i.source === "notification" && !i.isRead);
            case "notification":
                return items.filter((i) => i.source === "notification");
            case "alert":
                return items.filter((i) => i.source === "alert");
            default:
                return items;
        }
    }, [items, filter]);

    const unreadCount = useMemo(
        () => items.filter((i) => i.source === "notification" && !i.isRead).length,
        [items]
    );

    // states: waiting user, no user, loading data
    if (loadingUser) {
        return (
            <div className="notification-page">
                <main className="container">
                    <SkeletonList />
                </main>
            </div>
        );
    }

    if (!user?.id) {
        return (
            <div className="notification-page">
                <main className="container">
                    <EmptyState filter="all" />
                    <p className="mt-4 text-sm opacity-70">Sign in to see your notifications.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="notification-page">
            <main className="container">
                <div className="header-section">
                    <h2>Your Health Updates</h2>
                    <p>Stay informed with the latest notifications and health alerts tailored for you.</p>
                </div>

                <div className="filter-section">
                    <div className="filter-left">
                        <Filter className="filter-icon" />
                        <span>Filter:</span>
                        <Select value={filter} onValueChange={(v) => setFilter(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All items" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Updates</SelectItem>
                                <SelectItem value="notification">Notifications Only</SelectItem>
                                <SelectItem value="alert">Health Alerts Only</SelectItem>
                                <SelectItem value="unread">Unread Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {unreadCount > 0 && (
                        <div className="unread-count">
                            <div>Unread notifications</div>
                            <div>{unreadCount}</div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <SkeletonList />
                ) : filtered.length === 0 ? (
                    <EmptyState filter={filter} />
                ) : (
                    <div className="items-list">
                        {filtered.map((item) => (
                            <UnifiedCard key={item.id} item={item} onRead={() => markAsRead(item.id)} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

/* ---------------- Helpers & Components ---------------- */

function prettyLabel(s = "") {
    return s.replace(/[_-]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function TypeIcon({ t, source }) {
    if (source === "alert") {
        switch (t) {
            case "vaccination":
                return <CheckCircle className="icon" />;
            case "blood_donation":
                return <Heart className="icon" />;
            case "health_camp":
            default:
                return <Megaphone className="icon" />;
        }
    }
    switch (t) {
        case "appointment":
            return <Calendar className="icon" />;
        case "health_awareness":
            return <Heart className="icon" />;
        case "urgent":
            return <AlertCircle className="icon" />;
        case "general":
        default:
            return <CheckCircle className="icon" />;
    }
}

function Chip({ className = "", children }) {
    return <span className={`chip ${className}`}>{children}</span>;
}

function UnifiedCard({ item, onRead }) {
    const color =
        item.source === "alert"
            ? "alert"
            : item.type === "urgent"
                ? "urgent"
                : item.type === "appointment"
                    ? "appointment"
                    : item.type === "health_awareness"
                        ? "health_awareness"
                        : "default";

    return (
        <Card className={`card ${!item.isRead && item.source === "notification" ? "new" : ""}`}>
            <CardContent>
                <div className="card-content">
                    <div className="card-left">
                        <div className="icon-container">
                            <div className={`icon-bg ${color}`}>
                                <TypeIcon t={item.type} source={item.source} />
                            </div>
                            <div className="chips">
                                {/* show type for both alerts & notifications */}
                                <Chip className={`type ${item.type}`}>{prettyLabel(item.type)}</Chip>
                                {/* show priority if present (requires backend to return it) */}
                                {item.priority && (
                                    <Chip className={`priority ${item.priority}`}>{prettyLabel(item.priority)} priority</Chip>
                                )}
                                {!item.isRead && item.source === "notification" && <Chip className="new">New</Chip>}
                            </div>
                        </div>
                        {item.title && <p className="title">{item.title}</p>}
                        <p>{item.message}</p>
                        <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    {item.source === "notification" && !item.isRead && (
                        <Button variant="outline" size="sm" onClick={onRead}>
                            <Check className="mr-2" /> Mark as Read
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function SkeletonList() {
    return (
        <div className="skeleton-list">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="card">
                    <CardContent>
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function EmptyState({ filter }) {
    return (
        <Card className="card">
            <CardContent className="empty-state">
                <Bell className="icon-large" />
                <h3>No items found</h3>
                <p>{filter === "all" ? "You don't have any notifications or alerts yet." : `No ${filter} items found.`}</p>
            </CardContent>
        </Card>
    );
}
