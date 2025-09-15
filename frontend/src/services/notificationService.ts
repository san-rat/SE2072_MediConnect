// Mock data - in a real app, this would be API calls
type NotifType = "appointment" | "health-awareness" | "urgent" | "general"
type Priority = "low" | "normal" | "high" | "urgent"

const notifications: Array<{
  id: string
  message: string
  type: NotifType
  priority: Priority
  timestamp: string
  isRead: boolean
}> = [
  {
    id: "1",
    message:
      "Your appointment with Dr. Smith is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early for check-in.",
    type: "appointment",
    priority: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: "2",
    message:
      "Reminder: Annual flu vaccination is now available. Schedule your appointment to protect yourself and others.",
    type: "health-awareness",
    priority: "normal",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: false,
  },
  {
    id: "3",
    message: "Your lab results are ready for review. Please log into the patient portal or contact our office.",
    type: "general",
    priority: "normal",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
  },
]

export const notificationService = {
  async getNotifications() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return notifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  },

  async createNotification(data: { message: string; type: NotifType; priority: Priority }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newNotification = {
      id: Date.now().toString(),
      message: data.message,
      type: data.type,
      priority: data.priority || "normal",
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    notifications.unshift(newNotification)
    return newNotification
  },

  async markAsRead(id: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
    return notification
  }
}
