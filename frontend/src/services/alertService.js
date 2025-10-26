// src/services/alertService.js
import { ALERT_TYPES } from "./types";
import api from "../lib/api";

const API_PREFIX = "/api/alerts";

export const alertService = {
    async getAlerts() {
        const { data } = await api.get(API_PREFIX);
        return data;
    },

    async getUpcomingAlerts() {
        const { data } = await api.get(`${API_PREFIX}/upcoming`);
        return data;
    },

    async createAlert(payload) {
        if (!ALERT_TYPES.includes(payload.type)) {
            throw new Error("Invalid alert type");
        }
        const { data } = await api.post(API_PREFIX, payload);
        return data;
    },

    async getAlertById(id) {
        const { data } = await api.get(`${API_PREFIX}/${id}`);
        return data;
    },

    async deleteAlert(id) {
        await api.delete(`${API_PREFIX}/${id}`);
    },
};
