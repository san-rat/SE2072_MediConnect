import { NOTIF_TYPES } from "./types";
import api from "../lib/api";

const API_PREFIX = "/api/notifications";

export const notificationService = {
    // Get notifications for a user
    async getNotifications(userId) {
        const { data } = await api.get(`${API_PREFIX}/by-user/${userId}`);
        return data;
    },

    // Create a new notification for a single user
    async createNotification({ userId, ...payload }) {
        if (!NOTIF_TYPES.includes(payload.type)) {
            throw new Error("Invalid notification type");
        }
        const { data } = await api.post(`${API_PREFIX}/${userId}`, payload);
        return data;
    },

    // Create notifications for multiple users in parallel
    async createNotificationsForUsers(userIds, notifData) {
        const requests = userIds.map((userId) =>
            this.createNotification({ ...notifData, userId })
        );
        return Promise.all(requests);
    },

    // Mark a notification as read
    async markAsRead(id) {
        const { data } = await api.put(`${API_PREFIX}/${id}/read`);
        return data;
    },

    // Optional helper to query by different keys (matches your controller)
    async searchNotifications({ userId, email, firstName } = {}) {
        if (userId) {
            const { data } = await api.get(`${API_PREFIX}/by-user/${userId}`);
            return data;
        }
        if (email) {
            const { data } = await api.get(`${API_PREFIX}/by-email`, { params: { email } });
            return data;
        }
        if (firstName) {
            const { data } = await api.get(`${API_PREFIX}/by-first-name`, { params: { firstName } });
            return data;
        }
        throw new Error("Provide one of: userId, email, firstName");
    },
};
