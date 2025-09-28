// src/services/notificationService.ts
import type { NotifType } from "./types"

export type Notification = {
  id: number
  message: string
  type: string
  timestamp: string
  isRead: boolean
}


const BASE_URL = "http://localhost:8080/notifications"

export const notificationService = {
  // 🔹 Get notifications for a user
  async getNotifications(userId: number) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error("Failed to fetch notifications")
    return await res.json()
  },

  // 🔹 Create a new notification
  async createNotification(data: {
    message: string
    type: NotifType
    priority: Priority
    recipients: number[]
  }) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create notification")
    return await res.json()
  },

  // 🔹 Mark a notification as read
  async markAsRead(id: number) {
    const res = await fetch(`${BASE_URL}/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error("Failed to mark notification as read")
    return await res.json()
  },
}

//gitpush check