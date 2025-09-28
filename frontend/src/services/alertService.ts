import type { AlertType } from "./types"

export type Alert = {
    id: number
    title: string
    description: string
    date: string            // frontend-friendly (from eventDate or createdAt)
}

const BASE_URL = "http://localhost:8080/alerts" // backend base URL

export const alertService = {
    // 🔹 Get all alerts
    async getAlerts() {
        const res = await fetch(BASE_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error("Failed to fetch alerts")
        return await res.json()
    },

    // 🔹 Get upcoming alerts
    async getUpcomingAlerts() {
        const res = await fetch(`${BASE_URL}/upcoming`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error("Failed to fetch upcoming alerts")
        return await res.json()
    },

    // 🔹 Create a new alert
    async createAlert(data: { title: string; description: string; type: AlertType; date: string }) {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to create alert")
        return await res.json()
    },

    // 🔹 Get alert by ID
    async getAlertById(id: number) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error("Failed to fetch alert")
        return await res.json()
    },

    // 🔹 Delete an alert
    async deleteAlert(id: number) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete alert")
    },
}
