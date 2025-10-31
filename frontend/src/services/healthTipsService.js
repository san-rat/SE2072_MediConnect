// src/services/healthTipsService.js
import api from "../lib/api"; // same client your other services use

const API_PREFIX = "/api/health-tips";

export const healthTipsService = {
    // Patient-facing
    async getPersonalized(age, gender, condition) {
        const params = { age, gender };
        if (condition) params.condition = condition;
        const { data } = await api.get(`${API_PREFIX}/personalized`, { params });
        return data;
    },

    // Admin list (paged)
    async list(page = 0, size = 10, sortBy = "tipId", dir = "desc") {
        const params = { page, size, sortBy, dir };
        const { data } = await api.get(API_PREFIX, { params });
        return data;
    },

    // Admin create
    async create(tip) {
        const { data } = await api.post(API_PREFIX, tip);
        return data;
    },

    // Admin update
    async update(id, tip) {
        const { data } = await api.put(`${API_PREFIX}/${id}`, tip);
        return data;
    },

    // Admin delete
    async remove(id) {
        await api.delete(`${API_PREFIX}/${id}`);
    },
};
