import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import downloadFile from '../utils/downloadFile';
import './DoctorPrescriptionsPage.css';

const mockDoctorPrescriptions = [
  {
    id: 'RX-2025-001',
    prescriptionNumber: 'RX-2025-001',
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    date: '2025-10-04',
    medications: [
      { name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily', duration: '30 days' }
    ],
    instructions: 'Take with meals and monitor blood sugar twice daily.',
    notes: 'Patient responding well to current treatment plan.',
    fileName: 'sample-prescription.pdf',
    fileType: 'application/pdf',
    fileUrl: '/mock-prescriptions/sample-prescription.pdf'
  },
  {
    id: 'RX-2025-002',
    prescriptionNumber: 'RX-2025-002',
    patientName: 'Emily Davis',
    patientEmail: 'emily.d@email.com',
    date: '2025-10-01',
    medications: [
      { name: 'Sumatriptan', dosage: '50 mg', frequency: 'As needed', duration: '90 days' }
    ],
    instructions: 'Take at the first sign of migraine. Maximum 2 tablets per day.',
    notes: 'Patient reports reduced frequency of migraines.',
    fileName: 'sample-prescription.png',
    fileType: 'image/png',
    fileUrl: '/mock-prescriptions/sample-prescription.png'
  }
];

const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];

const createEmptyMedication = () => ({
  name: '',
  dosage: '',
  frequency: '',
  duration: ''
});

const createInitialFormState = () => ({
  prescriptionNumber: '',
  patientName: '',
  patientEmail: '',
  date: new Date().toISOString().slice(0, 10),
  medications: [createEmptyMedication()],
  instructions: '',
  notes: '',
  attachment: null
});

const deriveFileType = (fileName, fallbackType) => {
  if (fallbackType) {
    return fallbackType;
  }
  const lower = fileName?.toLowerCase() ?? '';
  if (lower.endsWith('.pdf')) {
    return 'application/pdf';
  }
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  return undefined;
};

const DoctorPrescriptionsPage = ({ user }) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formState, setFormState] = useState(createInitialFormState());
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const localFileUrls = useRef([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      setIsLoading(true);
      try {
        const data = await doctorAPI.getMyPrescriptions();
        const parsed = Array.isArray(data) ? data : [];
        const withIds = parsed.map((item, index) => ({
          ...item,
          id: item.id ?? item.prescriptionNumber ?? `doctor-prescription-${index}`
        }));
        setPrescriptions(withIds);
        setFeedback(null);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
        setPrescriptions(mockDoctorPrescriptions);
        setFeedback({
          type: 'warning',
          message: 'Unable to reach the prescriptions service. Showing the most recent local records.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  useEffect(() => () => {
    localFileUrls.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Unable to revoke object URL', error);
      }
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const sortedPrescriptions = useMemo(() => {
    return [...prescriptions].sort((a, b) => {
      const aDate = new Date(a.date || 0).getTime();
      const bDate = new Date(b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [prescriptions]);

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    setFormState((prev) => {
      const nextMedications = prev.medications.map((medication, medIndex) =>
        medIndex === index ? { ...medication, [field]: value } : medication
      );
      return { ...prev, medications: nextMedications };
    });
  };

  const addMedicationRow = () => {
    setFormState((prev) => ({
      ...prev,
      medications: [...prev.medications, createEmptyMedication()]
    }));
  };

  const removeMedicationRow = (index) => {
    setFormState((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, medIndex) => medIndex !== index)
    }));
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    if (!file) {
      setFormState((prev) => ({ ...prev, attachment: null }));
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      setFormError('Please upload a PDF, PNG, or JPEG file.');
      event.target.value = '';
      return;
    }

    setFormError('');
    setFormState((prev) => ({ ...prev, attachment: file }));
  };

  const removeAttachment = () => {
    setFormState((prev) => ({ ...prev, attachment: null }));
  };

  const toggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
    setFormError('');
  };

  const handleCreatePrescription = async (event) => {
    event.preventDefault();
    setFormError('');

    const trimmedMedications = formState.medications
      .map((medication) => ({
        name: medication.name.trim(),
        dosage: medication.dosage.trim(),
        frequency: medication.frequency.trim(),
        duration: medication.duration.trim()
      }))
      .filter((medication) => medication.name);

    if (!formState.prescriptionNumber.trim() || !formState.patientName.trim() || !formState.date) {
      setFormError('Prescription number, patient name, and date are required.');
      return;
    }

    if (trimmedMedications.length === 0) {
      setFormError('Add at least one medication with a name.');
      return;
    }

    if (!formState.attachment) {
      setFormError('Attach the prescription document (PDF, PNG, or JPEG).');
      return;
    }

    const attachment = formState.attachment;
    const attachmentName = attachment.name;

    const payload = {
      prescriptionNumber: formState.prescriptionNumber.trim(),
      patientName: formState.patientName.trim(),
      patientEmail: formState.patientEmail.trim(),
      date: formState.date,
      instructions: formState.instructions.trim(),
      notes: formState.notes.trim(),
      medications: trimmedMedications
    };

    setIsSubmitting(true);

    try {
      const created = await doctorAPI.createPrescription({
        ...payload,
        attachment
      });

      const fileUrlFromResponse = created?.fileUrl;
      const objectUrl = fileUrlFromResponse || URL.createObjectURL(attachment);
      if (!fileUrlFromResponse) {
        localFileUrls.current.push(objectUrl);
      }

      const newEntry = {
        ...payload,
        ...created,
        id: created?.id ?? Date.now(),
        fileName: created?.fileName ?? attachmentName,
        fileType: created?.fileType ?? attachment.type,
        fileUrl: objectUrl,
        source: created?.source ?? 'local'
      };

      if (!newEntry.medications || newEntry.medications.length === 0) {
        newEntry.medications = trimmedMedications;
      }

      if (!newEntry.fileType) {
        newEntry.fileType = deriveFileType(newEntry.fileName, attachment.type);
      }

      setPrescriptions((prev) => [newEntry, ...prev]);
      setFeedback({ type: 'success', message: 'Prescription uploaded successfully.' });
      setPreviewId(newEntry.id);
    } catch (error) {
      console.error('Error creating prescription:', error);
      const objectUrl = URL.createObjectURL(attachment);
      localFileUrls.current.push(objectUrl);
      const fallback = {
        id: Date.now(),
        ...payload,
        fileName: attachmentName,
        fileType: attachment.type,
        fileUrl: objectUrl,
        source: 'local'
      };
      setPrescriptions((prev) => [fallback, ...prev]);
      setFeedback({
        type: 'warning',
        message: 'Prescription saved locally and will sync once the service is available.'
      });
      setPreviewId(fallback.id);
    } finally {
      setIsSubmitting(false);
    }

    setShowCreateForm(false);
    setFormState(createInitialFormState());
  };

  const dismissFeedback = () => setFeedback(null);

  const togglePreview = (prescriptionId) => {
    setPreviewId((prev) => (prev === prescriptionId ? null : prescriptionId));
  };

  const handleDownload = async (prescription) => {
    if (!prescription.fileUrl) {
      return;
    }

    try {
      await downloadFile({
        url: prescription.fileUrl,
        fileName: prescription.fileName,
        fallbackName: prescription.prescriptionNumber || 'prescription'
      });
    } catch (error) {
      console.error('Unable to download prescription file', error);
    }
  };

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-prescriptions-page">
          <div className="page-header">
            <div>
              <h1>Prescriptions</h1>
              <p>Manage patient prescriptions and medication records</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={toggleCreateForm}
            >
              {showCreateForm ? 'Close form' : 'New prescription'}
            </button>
          </div>

          {feedback && (
            <div className={`feedback-banner ${feedback.type}`}>
              <span>{feedback.message}</span>
              <button type="button" onClick={dismissFeedback} aria-label="Dismiss notification">x</button>
            </div>
          )}

          {showCreateForm && (
            <form className="create-prescription-card" onSubmit={handleCreatePrescription}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="prescriptionNumber">Prescription number *</label>
                  <input
                    id="prescriptionNumber"
                    type="text"
                    value={formState.prescriptionNumber}
                    onChange={(event) => handleFieldChange('prescriptionNumber', event.target.value)}
                    placeholder="e.g. RX-2025-105"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="patientName">Patient name *</label>
                  <input
                    id="patientName"
                    type="text"
                    value={formState.patientName}
                    onChange={(event) => handleFieldChange('patientName', event.target.value)}
                    placeholder="Search or type patient name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="patientEmail">Patient email</label>
                  <input
                    id="patientEmail"
                    type="email"
                    value={formState.patientEmail}
                    onChange={(event) => handleFieldChange('patientEmail', event.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="prescriptionDate">Date *</label>
                  <input
                    id="prescriptionDate"
                    type="date"
                    value={formState.date}
                    onChange={(event) => handleFieldChange('date', event.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="prescriptionAttachment">Upload document *</label>
                  <input
                    id="prescriptionAttachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleAttachmentChange}
                  />
                  {formState.attachment && (
                    <div className="attachment-preview">
                      <span>{formState.attachment.name}</span>
                      <button type="button" onClick={removeAttachment} className="link-button">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="medications-section">
                <div className="section-header">
                  <h3>Medications *</h3>
                  <button type="button" className="link-button" onClick={addMedicationRow}>
                    Add medication
                  </button>
                </div>
                <div className="medications-grid">
                  {formState.medications.map((medication, index) => (
                    <div key={`medication-${index}`} className="medication-row">
                      <div className="form-field">
                        <label>Medication name *</label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(event) => handleMedicationChange(index, 'name', event.target.value)}
                          placeholder="Medication"
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>Dosage</label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(event) => handleMedicationChange(index, 'dosage', event.target.value)}
                          placeholder="e.g. 10 mg"
                        />
                      </div>
                      <div className="form-field">
                        <label>Frequency</label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(event) => handleMedicationChange(index, 'frequency', event.target.value)}
                          placeholder="e.g. Once daily"
                        />
                      </div>
                      <div className="form-field">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={medication.duration}
                          onChange={(event) => handleMedicationChange(index, 'duration', event.target.value)}
                          placeholder="e.g. 14 days"
                        />
                      </div>
                      {formState.medications.length > 1 && (
                        <button
                          type="button"
                          className="remove-medication"
                          onClick={() => removeMedicationRow(index)}
                          aria-label="Remove medication"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="instructions">Instructions</label>
                <textarea
                  id="instructions"
                  value={formState.instructions}
                  onChange={(event) => handleFieldChange('instructions', event.target.value)}
                  rows="3"
                  placeholder="Provide dosage guidance, follow-up instructions, or other notes for the patient"
                />
              </div>

              <div className="form-field">
                <label htmlFor="notes">Internal notes</label>
                <textarea
                  id="notes"
                  value={formState.notes}
                  onChange={(event) => handleFieldChange('notes', event.target.value)}
                  rows="3"
                  placeholder="Optional notes that remain visible only to clinical staff"
                />
              </div>

              {formError && <div className="form-error" role="alert">{formError}</div>}

              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={toggleCreateForm} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Upload prescription'}
                </button>
              </div>
            </form>
          )}

          <div className="prescriptions-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading prescriptions...</p>
              </div>
            ) : sortedPrescriptions.length > 0 ? (
              sortedPrescriptions.map((prescription) => {
                const isPreviewOpen = previewId === prescription.id;
                const fileType = deriveFileType(prescription.fileName, prescription.fileType);
                const hasPreview = prescription.fileUrl && fileType && (fileType === 'application/pdf' || fileType.startsWith('image/'));

                return (
                  <div key={prescription.id} className="prescription-card">
                    <div className="prescription-header">
                      <div className="prescription-info">
                        <h3>Prescription #{prescription.prescriptionNumber}</h3>
                        <p className="prescription-date">{new Date(prescription.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="patient-info">
                      <h4>{prescription.patientName}</h4>
                      {prescription.patientEmail && <p>{prescription.patientEmail}</p>}
                    </div>

                    <div className="medications-section">
                      <h5>Medications</h5>
                      <div className="medications-list">
                        {(prescription.medications || []).map((medication, index) => (
                          <div key={`${prescription.id}-medication-${index}`} className="medication-item">
                            <div className="medication-name">{medication.name}</div>
                            <div className="medication-details">
                              {medication.dosage && <span>{medication.dosage}</span>}
                              {medication.frequency && <span>{medication.frequency}</span>}
                              {medication.duration && <span>{medication.duration}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prescription.fileName && (
                      <div className="attachment-row">
                        <span className="attachment-label">Document</span>
                        <span className="attachment-value">{prescription.fileName}</span>
                      </div>
                    )}

                    {prescription.instructions && (
                      <div className="instructions-section">
                        <h5>Instructions</h5>
                        <p>{prescription.instructions}</p>
                      </div>
                    )}

                    {prescription.notes && (
                      <div className="notes-section">
                        <h5>Notes</h5>
                        <p>{prescription.notes}</p>
                      </div>
                    )}

                    {hasPreview && isPreviewOpen && (
                      <div className="file-preview">
                        {fileType?.startsWith('image/') && (
                          <img src={prescription.fileUrl} alt={prescription.fileName || 'Prescription image'} />
                        )}
                        {fileType === 'application/pdf' && (
                          <iframe
                            src={prescription.fileUrl}
                            title={prescription.fileName || prescription.prescriptionNumber || 'Prescription file'}
                            className="file-frame"
                            loading="lazy"
                          />
                        )}
                      </div>
                    )}

                    <div className="prescription-actions">
                      <button className="btn-primary" type="button" onClick={() => togglePreview(prescription.id)}>
                        {hasPreview ? (isPreviewOpen ? 'Hide file' : 'View file') : 'Preview unavailable'}
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => handleDownload(prescription)} disabled={!prescription.fileUrl}>
                        Download file
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-icon">[ ]</div>
                <h3>No prescriptions found</h3>
                <p>No prescriptions match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptionsPage;

