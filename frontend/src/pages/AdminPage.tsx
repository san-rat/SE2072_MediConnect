// src/pages/AdminPage.tsx
import { useState, type FormEvent } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, CheckCircle, AlertCircle, Calendar, Heart, Megaphone } from "lucide-react"
import { toast } from "sonner"

import { notificationService } from "../services/notificationService"
import { alertService } from "../services/alertService"
import Header from "../components/Header"
import type { NotifType, Priority, AlertType } from "../services/types"

type Mode = "notification" | "alert"

type NotificationForm = {
  message: string
  type: NotifType | ""
  priority: Priority
  recipients: string
}

type AlertForm = {
  title: string
  description: string
  type: AlertType
  eventDate: string
}

export default function AdminPage() {
  const [mode, setMode] = useState<Mode>("notification")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [notifForm, setNotifForm] = useState<NotificationForm>({
    message: "",
    type: "",
    priority: "normal",
    recipients: "",
  })

  const [alertForm, setAlertForm] = useState<AlertForm>({
    title: "",
    description: "",
    type: "vaccination",
    eventDate: "",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (mode === "notification") {
        if (!notifForm.type || !notifForm.message) return
        await notificationService.createNotification({
          message: notifForm.message,
          type: notifForm.type as NotifType,
          priority: notifForm.priority,
          recipients: notifForm.recipients
              .split(",")
              .map((id) => Number(id.trim()))
              .filter((n) => !isNaN(n)),
        })
        toast.success("Notification sent", { description: "Delivered to selected patients." })
        setNotifForm({ message: "", type: "", priority: "normal", recipients: "" })
      } else {
        if (!alertForm.title || !alertForm.description) return
        await alertService.createAlert({
          title: alertForm.title,
          description: alertForm.description,
          type: alertForm.type,
          date: alertForm.eventDate,
        })
        toast.success("Health Alert published", { description: "Visible to all patients." })
        setAlertForm({ title: "", description: "", type: "vaccination", eventDate: "" })
      }
    } catch {
      toast.error("Error", { description: "Please try again later." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const TypeIcon = ({ t }: { t: NotifType | AlertType | "" }) => {
    switch (t) {
      case "appointment": return <Calendar className="h-4 w-4" />
      case "health-awareness": return <Heart className="h-4 w-4" />
      case "urgent": return <AlertCircle className="h-4 w-4" />
      case "general": return <CheckCircle className="h-4 w-4" />
      case "vaccination": return <CheckCircle className="h-4 w-4" />
      case "blood-donation": return <Heart className="h-4 w-4" />
      case "health-camp": return <Megaphone className="h-4 w-4" />
      default: return <Send className="h-4 w-4" />
    }
  }

  return (
      <div className="min-h-screen bg-background text-foreground">
        <Header showLogin={false} />

        <main className="container-pro py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="mc-heading mb-4 text-3xl">Admin Panel</h2>
              <p className="mc-subheading mx-auto max-w-2xl">
                {mode === "notification"
                    ? "Send secure notifications to selected patients."
                    : "Publish health alerts visible to all patients."}
              </p>
            </div>

            <Card className="bg-card text-card-foreground border border-border shadow-[0_8px_30px_rgba(2,44,55,0.06)]">
              <CardHeader className="bg-muted/60 flex justify-between items-center">
                <CardTitle className="flex items-center gap-3 text-xl">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  {mode === "notification" ? <Send className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}
                </span>
                  {mode === "notification" ? "Create Notification" : "Publish Health Alert"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant={mode === "notification" ? "default" : "outline"} onClick={() => setMode("notification")}>
                    Notification
                  </Button>
                  <Button variant={mode === "alert" ? "default" : "outline"} onClick={() => setMode("alert")}>
                    Alert
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === "notification" ? (
                      <>
                        {/* Recipients */}
                        <div className="space-y-2">
                          <Label htmlFor="recipients">Recipients (IDs comma-separated)</Label>
                          <input
                              id="recipients"
                              type="text"
                              placeholder="e.g., 1,2,3"
                              value={notifForm.recipients}
                              onChange={(e) => setNotifForm((p) => ({ ...p, recipients: e.target.value }))}
                              className="w-full border rounded p-2"
                          />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                          <Label>Notification Type</Label>
                          <Select
                              value={notifForm.type}
                              onValueChange={(value: NotifType) => setNotifForm((p) => ({ ...p, type: value }))}
                          >
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appointment"><Calendar className="inline h-4 w-4 mr-2" /> Appointment</SelectItem>
                              <SelectItem value="health-awareness"><Heart className="inline h-4 w-4 mr-2" /> Health Awareness</SelectItem>
                              <SelectItem value="urgent"><AlertCircle className="inline h-4 w-4 mr-2" /> Urgent</SelectItem>
                              <SelectItem value="general"><CheckCircle className="inline h-4 w-4 mr-2" /> General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select
                              value={notifForm.priority}
                              onValueChange={(value: Priority) => setNotifForm((p) => ({ ...p, priority: value }))}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low"><Badge className="bg-green-500 h-2 w-2 rounded-full p-0" /> Low</SelectItem>
                              <SelectItem value="normal"><Badge className="bg-blue-500 h-2 w-2 rounded-full p-0" /> Normal</SelectItem>
                              <SelectItem value="high"><Badge className="bg-orange-500 h-2 w-2 rounded-full p-0" /> High</SelectItem>
                              <SelectItem value="urgent"><Badge className="bg-red-500 h-2 w-2 rounded-full p-0" /> Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea
                              value={notifForm.message}
                              onChange={(e) => setNotifForm((p) => ({ ...p, message: e.target.value }))}
                              placeholder="Enter notification message..."
                              className="resize-none"
                              required
                          />
                        </div>
                      </>
                  ) : (
                      <>
                        {/* Title */}
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <input
                              type="text"
                              value={alertForm.title}
                              onChange={(e) => setAlertForm((p) => ({ ...p, title: e.target.value }))}
                              className="w-full border rounded p-2"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                              value={alertForm.description}
                              onChange={(e) => setAlertForm((p) => ({ ...p, description: e.target.value }))}
                              placeholder="Enter alert details..."
                              required
                          />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                          <Label>Alert Type</Label>
                          <Select
                              value={alertForm.type}
                              onValueChange={(value: AlertType) => setAlertForm((p) => ({ ...p, type: value }))}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vaccination"><CheckCircle className="inline h-4 w-4 mr-2" /> Vaccination</SelectItem>
                              <SelectItem value="blood-donation"><Heart className="inline h-4 w-4 mr-2" /> Blood Donation</SelectItem>
                              <SelectItem value="health-camp"><Megaphone className="inline h-4 w-4 mr-2" /> Health Camp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                          <Label>Event Date</Label>
                          <input
                              type="date"
                              value={alertForm.eventDate}
                              onChange={(e) => setAlertForm((p) => ({ ...p, eventDate: e.target.value }))}
                              className="w-full border rounded p-2"
                          />
                        </div>
                      </>
                  )}

                  {/* Preview */}
                  <div className="rounded-lg bg-muted/60 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <TypeIcon t={mode === "notification" ? notifForm.type : alertForm.type} />
                      Preview
                    </h4>
                    <div className="text-sm text-muted-foreground">
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

                  {/* Submit */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : mode === "notification" ? "Send Notification" : "Publish Alert"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  )
}
