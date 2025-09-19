import api from "../lib/api";

export async function getAllDoctors() {
  const token = localStorage.getItem("mc_token");
  return api.get("/api/doctors", {
    headers: { Authorization: `Bearer ${token}` },
  });
}