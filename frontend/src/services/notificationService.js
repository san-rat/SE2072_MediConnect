import { NOTIF_TYPES } from "./types";
import api from "../lib/api";

export const notificationService = {
    // Get notifications for a user
    async getNotifications(userId) {
        const { data } = await api.get(`/notifications/${userId}`);
        return data;
    },

    // Create a new notification
    async createNotification(data) {
        // runtime validation using NOTIF_TYPES
        if (!NOTIF_TYPES.includes(data.type)) {
            throw new Error("Invalid notification type");
        }

        const { data: result } = await api.post("/notifications", data);
        return result;
    },

    // Mark a notification as read
    async markAsRead(id) {
        const { data } = await api.patch(`/notifications/${id}/read`);
        return data;
    },
};
