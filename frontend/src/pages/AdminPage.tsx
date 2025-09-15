import { useState, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, CheckCircle, AlertCircle, Calendar, Heart } from "lucide-react"
import { toast } from "sonner"
import { notificationService } from "../services/notificationService"
import Header from "../components/Header"

type FormShape = {
  message: string
  type: "" | "appointment" | "health-awareness" | "urgent" | "general"
  priority: "low" | "normal" | "high" | "urgent"
}

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormShape>({
    message: "",
    type: "",
    priority: "normal",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.message) return

    setIsSubmitting(true)
    try {
      await notificationService.createNotification({
        message: formData.message,
        type: formData.type as "appointment" | "health-awareness" | "urgent" | "general",
        priority: formData.priority
      })
      toast.success("Notification sent", {
        description: "Your notification has been delivered to patients.",
      })
      setFormData({ message: "", type: "", priority: "normal" })
    } catch {
      toast.error("Error sending notification", {
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const TypeIcon = ({ t }: { t: FormShape["type"] }) => {
    switch (t) {
      case "appointment": return <Calendar className="h-4 w-4" />
      case "health-awareness": return <Heart className="h-4 w-4" />
      case "urgent": return <AlertCircle className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showLogin={false} />

      <main className="container-pro py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="mc-heading mb-4 text-3xl">Send Patient Notifications</h2>
            <p className="mc-subheading mx-auto max-w-2xl">
              Create and send secure notifications to patients about appointments, health awareness, or urgent medical updates.
            </p>
          </div>

          <Card className="bg-card text-card-foreground border border-border shadow-[0_8px_30px_rgba(2,44,55,0.06)]">
            <CardHeader className="bg-muted/60">
              <CardTitle className="flex items-center gap-3 text-xl">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Send className="h-5 w-5" />
                </span>
                Create New Notification
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Fill out the form below to send a notification to your patients.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: FormShape["type"]) =>
                      setFormData((p) => ({ ...p, type: value }))
                    }
                  >
                    <SelectTrigger id="type" className="select-trigger">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-content bg-popover text-popover-foreground border border-border shadow-[0_12px_40px_rgba(2,44,55,0.10)]">
                      <SelectItem value="appointment" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Appointment Reminder</span>
                      </SelectItem>
                      <SelectItem value="health-awareness" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2"><Heart className="h-4 w-4" /> Health Awareness</span>
                      </SelectItem>
                      <SelectItem value="urgent" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Urgent Update</span>
                      </SelectItem>
                      <SelectItem value="general" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> General Information</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: FormShape["priority"]) =>
                      setFormData((p) => ({ ...p, priority: value }))
                    }
                  >
                    <SelectTrigger id="priority" className="select-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dropdown-content bg-popover text-popover-foreground border border-border shadow-[0_12px_40px_rgba(2,44,55,0.10)]">
                      <SelectItem value="low" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0 bg-green-500" /> Low
                        </span>
                      </SelectItem>
                      <SelectItem value="normal" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0 bg-blue-500" /> Normal
                        </span>
                      </SelectItem>
                      <SelectItem value="high" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0 bg-orange-500" /> High
                        </span>
                      </SelectItem>
                      <SelectItem value="urgent" className="px-3 py-2 focus:bg-muted data-[state=checked]:text-primary data-[state=checked]:font-medium">
                        <span className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0 bg-red-500" /> Urgent
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your notification message here..."
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="input min-h-32 resize-none"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep your message clear and concise for better patient understanding.
                  </p>
                </div>

                {/* Preview */}
                {formData.type && (
                  <div className="rounded-lg bg-muted/60 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <TypeIcon t={formData.type} />
                      Preview
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Type:</strong> {formData.type.replace("-", " ")}</p>
                      <p><strong>Priority:</strong> {formData.priority}</p>
                      {formData.message && <p><strong>Message:</strong> {formData.message}</p>}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="btn btn-primary w-full hover:bg-secondary"
                  disabled={isSubmitting || !formData.message || !formData.type}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending Notification…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
