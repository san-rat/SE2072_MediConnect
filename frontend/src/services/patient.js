import api from "../lib/api";

export async function getPatientProfile() {
  const response = await api.get("/api/patients/profile");
  return response.data;
}

export async function updatePatientProfile(profileData) {
  const response = await api.put("/api/patients/profile", profileData);
  return response.data;
}

export async function getMyPrescriptions() {
  const response = await api.get("/api/prescriptions/patient/my");
  return response.data;
}

export async function getMyMedicalRecords() {
  const response = await api.get("/api/medical-records/patient/my");
  return response.data;
}
