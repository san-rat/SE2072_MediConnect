import React, { useState } from "react";
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("✅ Prescription uploaded successfully!");
  };

  return (
    <div className="hospital-bg">
      {/* Header */}
      <header className="hospital-header">
        <img
          src="/MediConnect.jpg"
          alt="MediConnect Logo"
          className="hospital-logo"
        />
        <div className="hospital-title-group">
          <h1 className="hospital-title">MediConnect Hospital</h1>
          <p className="hospital-subtitle">Prescription Management Portal</p>
        </div>
      </header>

      {/* Main */}
      <main className="hospital-main">
        <section className="hospital-section">
          <h2 className="hospital-section-title">Welcome, Doctor!</h2>
          <p className="hospital-intro">
            Upload patient prescriptions securely and digitally.
          </p>

          <form className="hospital-form" onSubmit={handleSubmit}>
            <label className="prescription-form-label" htmlFor="patientId">
              Patient ID
            </label>
            <input
              className="prescription-form-input"
              id="patientId"
              type="text"
              placeholder="Enter Patient ID"
              required
            />

            <label className="prescription-form-label" htmlFor="doctorId">
              Doctor ID
            </label>
            <input
              className="prescription-form-input"
              id="doctorId"
              type="text"
              placeholder="Enter Doctor ID"
              required
            />

            <label className="prescription-form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              className="prescription-form-textarea"
              id="notes"
              rows="3"
              placeholder="Add notes (optional)"
            />

            <label className="prescription-form-label" htmlFor="file">
              Upload Prescription File
            </label>
            <input
              className="prescription-form-input"
              id="file"
              type="file"
              required
            />

            <button className="prescription-form-button" type="submit">
              Upload Prescription
            </button>
          </form>

          {message && (
            <p className="prescription-form-message success">{message}</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="hospital-footer">
        <p>
          &copy; {new Date().getFullYear()} MediConnect Hospital. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
