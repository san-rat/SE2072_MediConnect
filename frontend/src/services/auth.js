import api from "../lib/api";

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  localStorage.setItem("mc_token", data.token);
  localStorage.setItem("mc_role", data.role);
  return data;
}

export async function registerPatient(formData) {
  return api.post("/api/auth/register/patient", formData);
}

export async function registerDoctor(formData) {
  return api.post("/api/auth/register/doctor", formData);
}