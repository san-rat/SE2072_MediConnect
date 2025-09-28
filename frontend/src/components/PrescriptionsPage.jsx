import React, { useEffect, useState } from "react";
import "./PrescriptionsPage.css";
import useCurrentUser from "../hooks/useCurrentUser";
import api from "../lib/api";
import PatientPrescriptions from "./PatientPrescriptions";
import Logo from "../assets/827a7642-638b-4ce3-b70f-c34f15d66ad5.png";

export default function PrescriptionsPage() {
  // Step 1 — pick role + id
  const [stage, setStage] = useState("select"); // "select" | "doctor" | "patient"
  const [role, setRole] = useState("doctor");
  const [idInput, setIdInput] = useState("");

  // Doctor upload form
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // Current user (for optional prefill)
  const { user } = useCurrentUser();

  // Prefill ID from current user when available
  useEffect(() => {
    if (role === "doctor") {
      const maybe = user?.doctorId || user?.id;
      if (maybe) setIdInput((prev) => prev || String(maybe));
    } else if (role === "patient") {
      const maybe = user?.patientId || user?.id;
      if (maybe) setIdInput((prev) => prev || String(maybe));
    }
  }, [role, user]);

  const begin = (e) => {
    e.preventDefault();
    if (!idInput.trim()) return setMsg("Please enter your ID.");
    setMsg("");
    if (role === "doctor") {
      setDoctorId(idInput.trim()); // prefill on upload form
      setStage("doctor");
    } else {
      setStage("patient");
    }
  };

  const backToSelect = () => {
    setStage("select");
    setMsg("");
    setDownloadUrl("");
    setFile(null);
  };

  // Doctor → upload prescription
  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("❌ Please choose a file.");
    if (!patientId.trim() || !doctorId.trim()) {
      return setMsg("❌ Patient ID and Doctor ID are required.");
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("patientId", patientId.trim());
      fd.append("doctorId", doctorId.trim());
      if (notes) fd.append("notes", notes);

      // Use the shared axios client; prefix with /api
      const res = await api.post("/api/prescriptions/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const id = res.data && res.data.id;
      const base = (api.defaults.baseURL || "").replace(/\/+$/, "");
      setDownloadUrl(id ? `${base}/api/prescriptions/${id}/download` : "");
      setMsg("✅ Uploaded successfully!");
      setPatientId("");
      setNotes("");
      setFile(null);
    } catch (err) {
      if (err.response) setMsg(`❌ Upload failed: ${err.response.data}`);
      else if (err.request) setMsg("❌ Upload failed: No response from backend");
      else setMsg(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <main className="prescriptions-page">
      <div className="page-container">

        {/* Hero with logo */}
        <div className="page-hero">
          <img className="hero-logo" src={Logo} alt="MediConnect" />
          <div>
            <h1 className="hero-title">Prescriptions</h1>
            <p className="hero-sub">Upload (Doctor) or view & download (Patient)</p>
          </div>
        </div>

        {/* Stage 1: choose role + enter ID */}
        {stage === "select" && (
          <div className="prescription-card">
            <h3 className="card-title">Who are you?</h3>
            <form onSubmit={begin} className="form-grid">
              <div className="radio-row">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={() => setRole("doctor")}
                  />
                  Doctor
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={role === "patient"}
                    onChange={() => setRole("patient")}
                  />
                  Patient
                </label>
              </div>

              <label className="prescription-form-label">
                {role === "doctor" ? "Doctor ID" : "Patient ID"}
              </label>
              <input
                className="prescription-form-input"
                placeholder={role === "doctor" ? "Enter Doctor ID (e.g., D001)" : "Enter Patient ID (e.g., P001)"}
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                required
              />

              <button className="btn btn-primary btn-large" type="submit">
                Done
              </button>

              {msg && <p className="prescription-form-message">{msg}</p>}
            </form>
          </div>
        )}

        {/* Stage 2A: Doctor upload */}
        {stage === "doctor" && (
          <div className="prescription-card">
            <div className="section-header">
              <h3 className="card-title">Upload a Prescription</h3>
              <button className="btn btn-outline btn-small" onClick={backToSelect}>
                ← Back
              </button>
            </div>

            <form onSubmit={upload} className="form-grid">
              <label className="prescription-form-label">Patient ID</label>
              <input
                className="prescription-form-input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter Patient ID"
                required
              />

              <label className="prescription-form-label">Doctor ID</label>
              <input
                className="prescription-form-input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="Enter Doctor ID"
                required
              />

              <label className="prescription-form-label">Notes</label>
              <textarea
                className="prescription-form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (optional)"
                rows={3}
              />

              <label className="prescription-form-label">Upload Prescription File</label>
              <input
                className="prescription-form-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                required
              />

              <button className="btn btn-primary" type="submit">
                Upload Prescription
              </button>
            </form>

            {msg && <p className="prescription-form-message" style={{ marginTop: 8 }}>{msg}</p>}
            {downloadUrl && (
              <p style={{ marginTop: 8 }}>
                Open file:{" "}
                <a href={downloadUrl} target="_blank" rel="noreferrer">
                  {downloadUrl}
                </a>
              </p>
            )}
          </div>
        )}

        {/* Stage 2B: Patient list + preview + download */}
        {stage === "patient" && (
          <PatientPrescriptions
            patientId={idInput.trim()}
            onBack={backToSelect}
          />
        )}
      </div>
    </main>
  );
}
