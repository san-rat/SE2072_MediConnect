import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorMedicalRecordsPage.css';

const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

const mockRecords = [
  {
    id: 'MR-2025-001',
    recordNumber: 'MR-2025-001',
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    date: '2025-09-12',
    summary: 'Post-surgery discharge summary with follow-up notes.',
    fileName: 'sample-medical-record.pdf',
    fileType: 'application/pdf',
    fileUrl: '/mock-medical-records/sample-medical-record.pdf'
  },
  {
    id: 'MR-2025-002',
    recordNumber: 'MR-2025-002',
    patientName: 'Emily Davis',
    patientEmail: 'emily.d@email.com',
    date: '2025-08-30',
    summary: 'Comprehensive physical exam and lab results.',
    fileName: 'sample-medical-record.png',
    fileType: 'image/png',
    fileUrl: '/mock-medical-records/sample-medical-record.png'
  }
];

const createInitialFormState = () => ({
  recordNumber: '',
  patientName: '',
  patientEmail: '',
  date: new Date().toISOString().slice(0, 10),
  summary: '',
  attachment: null
});

const detectFileType = (fileName, fallbackType) => {
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
  if (lower.endsWith('.gif')) {
    return 'image/gif';
  }
  if (lower.endsWith('.bmp')) {
    return 'image/bmp';
  }
  return undefined;
};

const canPreviewInline = (record) => {
  const fileType = detectFileType(record.fileName, record.fileType);
  if (!record.fileUrl || !fileType) {
    return false;
  }
  return fileType === 'application/pdf' || fileType.startsWith('image/');
};

const DoctorMedicalRecordsPage = ({ user }) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formState, setFormState] = useState(createInitialFormState());
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const localFileUrls = useRef([]);

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const data = await doctorAPI.getMyMedicalRecords();
        const parsed = Array.isArray(data) ? data : [];
        const withIds = parsed.map((item, index) => ({
          ...item,
          id: item.id ?? item.recordNumber ?? `doctor-medical-record-${index}`
        }));
        setRecords(withIds);
        setFeedback(null);
      } catch (error) {
        console.error('Error loading medical records:', error);
        setRecords(mockRecords);
        setFeedback({
          type: 'warning',
          message: 'Unable to reach the medical record service. Showing the most recent local records.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
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

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const aDate = new Date(a.date || 0).getTime();
      const bDate = new Date(b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [records]);

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    if (!file) {
      setFormState((prev) => ({ ...prev, attachment: null }));
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      setFormError('Please upload a PDF or common image file (PNG, JPEG, GIF, BMP).');
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

  const handleCreateRecord = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!formState.recordNumber.trim() || !formState.patientName.trim() || !formState.date) {
      setFormError('Record number, patient name, and date are required.');
      return;
    }

    if (!formState.attachment) {
      setFormError('Attach the medical record document (PDF or image).');
      return;
    }

    const attachment = formState.attachment;
    const payload = {
      recordNumber: formState.recordNumber.trim(),
      patientName: formState.patientName.trim(),
      patientEmail: formState.patientEmail.trim(),
      date: formState.date,
      summary: formState.summary.trim()
    };

    setIsSubmitting(true);

    try {
      const created = await doctorAPI.createMedicalRecord({
        ...payload,
        attachment
      });

      const fileUrlFromResponse = created?.fileUrl;
      const objectUrl = fileUrlFromResponse || URL.createObjectURL(attachment);
      if (!fileUrlFromResponse) {
        localFileUrls.current.push(objectUrl);
      }

      const record = {
        ...payload,
        ...created,
        id: created?.id ?? Date.now(),
        fileName: created?.fileName ?? attachment.name,
        fileType: created?.fileType ?? attachment.type,
        fileUrl: objectUrl,
        source: created?.source ?? 'local'
      };

      if (!record.fileType) {
        record.fileType = detectFileType(record.fileName, attachment.type);
      }

      setRecords((prev) => [record, ...prev]);
      setFeedback({ type: 'success', message: 'Medical record uploaded successfully.' });
      setPreviewId(record.id);
    } catch (error) {
      console.error('Error creating medical record:', error);
      const objectUrl = URL.createObjectURL(attachment);
      localFileUrls.current.push(objectUrl);
      const fallback = {
        id: Date.now(),
        ...payload,
        fileName: attachment.name,
        fileType: attachment.type,
        fileUrl: objectUrl,
        source: 'local'
      };
      setRecords((prev) => [fallback, ...prev]);
      setFeedback({
        type: 'warning',
        message: 'Medical record stored locally and will sync once the service is available.'
      });
      setPreviewId(fallback.id);
    } finally {
      setIsSubmitting(false);
    }

    setShowCreateForm(false);
    setFormState(createInitialFormState());
  };

  const dismissFeedback = () => setFeedback(null);

  const togglePreview = (recordId) => {
    setPreviewId((prev) => (prev === recordId ? null : recordId));
  };

  const handleDownload = (record) => {
    if (!record.fileUrl) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = record.fileUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.download = record.fileName || record.recordNumber || 'medical-record';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-medical-records-page">
          <div className="page-header">
            <div>
              <h1>Medical Records</h1>
              <p>Upload and manage patient medical documents</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={toggleCreateForm}
            >
              {showCreateForm ? 'Close form' : 'New record'}
            </button>
          </div>

          {feedback && (
            <div className={`feedback-banner ${feedback.type}`}>
              <span>{feedback.message}</span>
              <button type="button" onClick={dismissFeedback} aria-label="Dismiss notification">x</button>
            </div>
          )}

          {showCreateForm && (
            <form className="create-record-card" onSubmit={handleCreateRecord}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="recordNumber">Record number *</label>
                  <input
                    id="recordNumber"
                    type="text"
                    value={formState.recordNumber}
                    onChange={(event) => handleFieldChange('recordNumber', event.target.value)}
                    placeholder="e.g. MR-2025-108"
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
                  <label htmlFor="recordDate">Date *</label>
                  <input
                    id="recordDate"
                    type="date"
                    value={formState.date}
                    onChange={(event) => handleFieldChange('date', event.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="recordAttachment">Upload document *</label>
                  <input
                    id="recordAttachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp"
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

              <div className="form-field">
                <label htmlFor="recordSummary">Summary</label>
                <textarea
                  id="recordSummary"
                  value={formState.summary}
                  onChange={(event) => handleFieldChange('summary', event.target.value)}
                  rows="3"
                  placeholder="Provide a short description of the document contents"
                />
              </div>

              {formError && <div className="form-error" role="alert">{formError}</div>}

              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={toggleCreateForm} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Upload record'}
                </button>
              </div>
            </form>
          )}

          <div className="records-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading medical records...</p>
              </div>
            ) : sortedRecords.length > 0 ? (
              sortedRecords.map((record) => {
                const isPreviewOpen = previewId === record.id;
                const fileType = detectFileType(record.fileName, record.fileType);
                const showPreview = canPreviewInline(record) && isPreviewOpen;

                return (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <div className="record-info">
                        <h3>Record #{record.recordNumber}</h3>
                        <p className="record-date">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="patient-info">
                      <h4>{record.patientName}</h4>
                      {record.patientEmail && <p>{record.patientEmail}</p>}
                    </div>

                    {record.summary && (
                      <div className="summary-block">
                        <h5>Summary</h5>
                        <p>{record.summary}</p>
                      </div>
                    )}

                    {record.fileName && (
                      <div className="attachment-row">
                        <span className="attachment-label">Document</span>
                        <span className="attachment-value">{record.fileName}</span>
                      </div>
                    )}

                    {showPreview && (
                      <div className="file-preview">
                        {fileType?.startsWith('image/') && (
                          <img src={record.fileUrl} alt={record.fileName || 'Medical record image'} />
                        )}
                        {fileType === 'application/pdf' && (
                          <iframe
                            src={record.fileUrl}
                            title={record.fileName || record.recordNumber || 'Medical record file'}
                            className="file-frame"
                            loading="lazy"
                          />
                        )}
                      </div>
                    )}

                    <div className="record-actions">
                      <button className="btn-primary" type="button" onClick={() => togglePreview(record.id)}>
                        {canPreviewInline(record) ? (isPreviewOpen ? 'Hide file' : 'View file') : 'Preview unavailable'}
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => handleDownload(record)} disabled={!record.fileUrl}>
                        Download file
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-icon">[ ]</div>
                <h3>No medical records found</h3>
                <p>No records match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecordsPage;
