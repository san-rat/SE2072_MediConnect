// src/services/user.js
import api from "../lib/api";

export async function getAllDoctors() {
  const token = localStorage.getItem("mc_token");
  const { data } = await api.get("/api/doctors", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getAllUsers() {
  const token = localStorage.getItem("mc_token");
  const { data } = await api.get("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// optional: search endpoint (if backend supports /api/users/search?q=...)
export async function searchUsers(query) {
  const token = localStorage.getItem("mc_token");
  const { data } = await api.get("/api/users/search", {
    params: { q: query },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
