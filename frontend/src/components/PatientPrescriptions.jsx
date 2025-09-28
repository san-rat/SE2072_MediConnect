import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function PatientPrescriptions({ patientId, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setErr("");
    try {
      // IMPORTANT: prefix with /api
      const res = await api.get(`/api/prescriptions/patient/${encodeURIComponent(patientId)}`);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data || e?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso ?? ""; }
  };

  // Proper preview: keep the MIME type returned by the backend
  const viewFile = async (p) => {
    try {
      setSelected(p);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(""); setPreviewType("");

      const res = await api.get(`/api/prescriptions/${p.id}/download`, {
        responseType: "blob",
        headers: { Accept: "application/pdf,image/*" },
      });

      const type = res.headers["content-type"] || res.headers["Content-Type"] || "application/pdf";
      const blob = new Blob([res.data], { type });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewType(type);
    } catch (e) {
      setErr(e?.response?.data || e?.message || "Failed to load file");
    }
  };

  const downloadHref = (id) => {
    const base = (api?.defaults?.baseURL || "").replace(/\/+$/, "");
    return `${base}/api/prescriptions/${id}/download`;
  };

  return (
    <section className="prescription-card">
      <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{ margin: 0 }}>Prescriptions for Patient {patientId}</h3>
        <button className="btn btn-outline btn-small" onClick={onBack}>← Back</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="prescription-form-message error">❌ {err}</p>}
      {!loading && rows.length === 0 && <p>No prescriptions found.</p>}

      {rows.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="mc-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Doctor ID</th>
                <th>Notes</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{formatDate(p.prescriptionDate)}</td>
                  <td>{p.doctorId}</td>
                  <td>{p.notes || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-outline btn-small" onClick={() => viewFile(p)}>View</button>
                      <a className="btn btn-primary btn-small" href={downloadHref(p.id)} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selected && (
            <>
              <h4 style={{ marginTop: 20, marginBottom: 8 }}>Preview</h4>
              <div className="preview-box">
                {previewType.includes("pdf") ? (
                  <object data={previewUrl} type="application/pdf" width="100%" height="100%">
                    <iframe title="PDF Preview" src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }} />
                  </object>
                ) : previewType.startsWith("image/") ? (
                  <img src={previewUrl} alt="Prescription preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <iframe title="Preview" src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }} />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
