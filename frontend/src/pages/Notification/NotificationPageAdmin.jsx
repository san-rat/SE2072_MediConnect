import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"; // adjust path
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Send, CheckCircle, AlertCircle, Calendar, Heart, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { notificationService } from "@/services/notificationService.js";
import { alertService } from "@/services/alertService.js";
import "./notificationPageAdmin.css";

export default function AdminPage() {
    const [mode, setMode] = useState("notification");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [notifForm, setNotifForm] = useState({
        message: "",
        type: "",
        priority: "normal",
        recipients: "",
    });

    const [alertForm, setAlertForm] = useState({
        title: "",
        description: "",
        type: "vaccination",
        eventDate: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (mode === "notification") {
                if (!notifForm.type || !notifForm.message) return;
                const firstRecipient = notifForm.recipients
                    .split(",")
                    .map((id) => Number(id.trim()))
                    .find((n) => !isNaN(n));
                if (!firstRecipient) throw new Error("No valid recipient");

                await notificationService.createNotification({
                    userId: firstRecipient,
                    title: "Admin Message",
                    message: notifForm.message,
                    type: notifForm.type,
                });
                toast.success("Notification sent", { description: "Delivered to selected patients." });
                setNotifForm({ message: "", type: "", priority: "normal", recipients: "" });
            } else {
                if (!alertForm.title || !alertForm.description) return;
                await alertService.createAlert({
                    title: alertForm.title,
                    description: alertForm.description,
                    eventDate: alertForm.eventDate,
                    type: alertForm.type,
                });
                toast.success("Health Alert published", { description: "Visible to all patients." });
                setAlertForm({ title: "", description: "", type: "vaccination", eventDate: "" });
            }
        } catch {
            toast.error("Error", { description: "Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const TypeIcon = ({ t }) => {
        switch (t) {
            case "appointment": return <Calendar className="h-4 w-4" />;
            case "health_awareness": return <Heart className="h-4 w-4" />;
            case "urgent": return <AlertCircle className="h-4 w-4" />;
            case "general": return <CheckCircle className="h-4 w-4" />;
            case "vaccination": return <CheckCircle className="h-4 w-4" />;
            case "blood_donation": return <Heart className="h-4 w-4" />;
            case "health_camp": return <Megaphone className="h-4 w-4" />;
            default: return <Send className="h-4 w-4" />;
        }
    };

    return (
        <div className="admin-page">
            <main className="container">
                <div className="header-section">
                    <h2>Admin Panel</h2>
                    <p>
                        {mode === "notification"
                            ? "Send secure notifications to selected patients."
                            : "Publish health alerts visible to all patients."}
                    </p>
                </div>

                <Card className="admin-card">
                    <CardHeader className="card-header">
                        <CardTitle className="card-title">
              <span className="icon-circle">
                {mode === "notification" ? <Send /> : <Megaphone />}
              </span>
                            {mode === "notification" ? "Create Notification" : "Publish Health Alert"}
                        </CardTitle>
                        <div className="mode-buttons">
                            <Button variant={mode === "notification" ? "default" : "outline"} onClick={() => setMode("notification")}>Notification</Button>
                            <Button variant={mode === "alert" ? "default" : "outline"} onClick={() => setMode("alert")}>Alert</Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="form-space">
                            {mode === "notification" ? (
                                <>
                                    <div className="form-group">
                                        <Label htmlFor="recipients">Recipients (IDs comma-separated)</Label>
                                        <input
                                            id="recipients"
                                            type="text"
                                            placeholder="e.g., 1,2,3"
                                            value={notifForm.recipients}
                                            onChange={(e) => setNotifForm((p) => ({ ...p, recipients: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Label>Notification Type</Label>
                                        <Select value={notifForm.type} onValueChange={(value) => setNotifForm((p) => ({ ...p, type: value }))}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="appointment"><Calendar className="inline" /> Appointment</SelectItem>
                                                <SelectItem value="health_awareness"><Heart className="inline" /> Health Awareness</SelectItem>
                                                <SelectItem value="urgent"><AlertCircle className="inline" /> Urgent</SelectItem>
                                                <SelectItem value="general"><CheckCircle className="inline" /> General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <Label>Priority</Label>
                                        <Select value={notifForm.priority} onValueChange={(value) => setNotifForm((p) => ({ ...p, priority: value }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low"><Badge className="badge-low" /> Low</SelectItem>
                                                <SelectItem value="normal"><Badge className="badge-normal" /> Normal</SelectItem>
                                                <SelectItem value="high"><Badge className="badge-high" /> High</SelectItem>
                                                <SelectItem value="urgent"><Badge className="badge-urgent" /> Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <Label>Message</Label>
                                        <Textarea
                                            value={notifForm.message}
                                            onChange={(e) => setNotifForm((p) => ({ ...p, message: e.target.value }))}
                                            placeholder="Enter notification message..."
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <Label>Title</Label>
                                        <input
                                            type="text"
                                            value={alertForm.title}
                                            onChange={(e) => setAlertForm((p) => ({ ...p, title: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={alertForm.description}
                                            onChange={(e) => setAlertForm((p) => ({ ...p, description: e.target.value }))}
                                            placeholder="Enter alert details..."
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Label>Alert Type</Label>
                                        <Select value={alertForm.type} onValueChange={(value) => setAlertForm((p) => ({ ...p, type: value }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vaccination"><CheckCircle className="inline" /> Vaccination</SelectItem>
                                                <SelectItem value="blood_donation"><Heart className="inline" /> Blood Donation</SelectItem>
                                                <SelectItem value="health_camp"><Megaphone className="inline" /> Health Camp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <Label>Event Date</Label>
                                        <input
                                            type="date"
                                            value={alertForm.eventDate}
                                            onChange={(e) => setAlertForm((p) => ({ ...p, eventDate: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="preview">
                                <h4><TypeIcon t={mode === "notification" ? notifForm.type : alertForm.type} /> Preview</h4>
                                <div>
                                    {mode === "notification" ? (
                                        <>
                                            {notifForm.type && <p><strong>Type:</strong> {notifForm.type}</p>}
                                            <p><strong>Priority:</strong> {notifForm.priority}</p>
                                            {notifForm.message && <p><strong>Message:</strong> {notifForm.message}</p>}
                                        </>
                                    ) : (
                                        <>
                                            {alertForm.title && <p><strong>Title:</strong> {alertForm.title}</p>}
                                            {alertForm.type && <p><strong>Type:</strong> {alertForm.type}</p>}
                                            {alertForm.eventDate && <p><strong>Date:</strong> {alertForm.eventDate}</p>}
                                            {alertForm.description && <p><strong>Description:</strong> {alertForm.description}</p>}
                                        </>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting…" : mode === "notification" ? "Send Notification" : "Publish Alert"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
