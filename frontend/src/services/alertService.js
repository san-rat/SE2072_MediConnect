import { ALERT_TYPES } from "./types";
import api from "../lib/api";

export const alertService = {
    async getAlerts() {
        const { data } = await api.get("/alerts");
        return data;
    },

    async getUpcomingAlerts() {
        const { data } = await api.get("/alerts/upcoming");
        return data;
    },

    async createAlert(data) {
        // runtime validation using ALERT_TYPES
        if (!ALERT_TYPES.includes(data.type)) {
            throw new Error("Invalid alert type");
        }

        const { data: result } = await api.post("/alerts", data);
        return result;
    },

    async getAlertById(id) {
        const { data } = await api.get(`/alerts/${id}`);
        return data;
    },

    async deleteAlert(id) {
        await api.delete(`/alerts/${id}`);
    },
};
