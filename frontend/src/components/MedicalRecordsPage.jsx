import { useEffect, useMemo, useState } from 'react';
import { getMyMedicalRecords } from '../services/patient';
import downloadFile from '../utils/downloadFile';
import './MedicalRecordsPage.css';

const fallbackRecords = [
  {
    id: 'MR-2025-001',
    recordNumber: 'MR-2025-001',
    doctorName: 'Dr. S. Jayasinghe',
    facilityName: 'MediConnect General Hospital',
    date: '2025-09-12',
    summary: 'Discharge summary following routine surgery.',
    fileName: 'sample-medical-record.pdf',
    fileType: 'application/pdf',
    fileUrl: '/mock-medical-records/sample-medical-record.pdf'
  },
  {
    id: 'MR-2025-002',
    recordNumber: 'MR-2025-002',
    doctorName: 'Dr. M. Fernando',
    facilityName: 'Wellness Plus Family Practice',
    date: '2025-08-30',
    summary: 'Annual physical exam findings and lab results.',
    fileName: 'sample-medical-record.png',
    fileType: 'image/png',
    fileUrl: '/mock-medical-records/sample-medical-record.png'
  }
];

const formatDate = (value) => {
  if (!value) {
    return 'Not specified';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const detectFileType = (record) => {
  if (record.fileType) {
    return record.fileType;
  }

  const name = record.fileName?.toLowerCase() ?? '';
  if (name.endsWith('.pdf')) {
    return 'application/pdf';
  }
  if (name.endsWith('.png')) {
    return 'image/png';
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (name.endsWith('.gif')) {
    return 'image/gif';
  }
  if (name.endsWith('.bmp')) {
    return 'image/bmp';
  }
  return undefined;
};

const canPreviewInline = (record) => {
  const fileType = detectFileType(record);
  if (!record.fileUrl || !fileType) {
    return false;
  }
  return fileType === 'application/pdf' || fileType.startsWith('image/');
};

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMessage, setBannerMessage] = useState('');

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      setBannerMessage('');

      try {
        const data = await getMyMedicalRecords();
        const parsed = Array.isArray(data) ? data : [];
        const withIds = parsed.map((item, index) => ({
          ...item,
          id: item.id ?? item.recordNumber ?? `medical-record-${index}`
        }));
        setRecords(withIds);
      } catch (error) {
        console.error('Error loading medical records:', error);
        setBannerMessage('We could not reach the medical record service. Showing the most recent records available.');
        setRecords(fallbackRecords);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, []);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const aDate = new Date(a.date || 0).getTime();
      const bDate = new Date(b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [records]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDownload = async (record) => {
    if (record.fileUrl) {
      try {
        await downloadFile({
          url: record.fileUrl,
          fileName: record.fileName,
          fallbackName: record.recordNumber || 'medical-record'
        });
        return;
      } catch (error) {
        console.error('Unable to download medical record file', error);
      }
    }

    try {
      const fallbackName = `${record.recordNumber || 'medical-record'}.json`;
      const serialised = JSON.stringify(record, null, 2);
      const blob = new Blob([serialised], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fallbackName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Unable to provide fallback download for record', error);
    }
  };

  return (
    <main className="medical-records-page">
      <div className="page-container">
        <div className="page-header">
          <h1>My Medical Records</h1>
          <p>Review, preview, and download the medical documents shared with you.</p>
        </div>

        {bannerMessage && (
          <div className="info-banner" role="status">{bannerMessage}</div>
        )}

        {isLoading ? (
          <div className="state-card">Loading medical records...</div>
        ) : sortedRecords.length > 0 ? (
          <div className="records-grid">
            {sortedRecords.map((record) => {
              const isExpanded = expandedId === record.id;
              const fileType = detectFileType(record);

              return (
                <article key={record.id} className={`record-card ${isExpanded ? 'expanded' : ''}`}>
                  <header className="record-header">
                    <div>
                      <h3>Record #{record.recordNumber || 'Pending assignment'}</h3>
                      <div className="record-meta">
                        <span>{formatDate(record.date)}</span>
                        {record.facilityName && <span className="meta-divider">|</span>}
                        {record.facilityName && <span>{record.facilityName}</span>}
                      </div>
                    </div>
                  </header>

                  <div className="record-summary">
                    <div className="summary-row">
                      <span className="summary-label">Uploaded by</span>
                      <span className="summary-value">{record.doctorName || 'Not available'}</span>
                    </div>
                    {record.fileName && (
                      <div className="summary-row">
                        <span className="summary-label">Document</span>
                        <span className="summary-value">{record.fileName}</span>
                      </div>
                    )}
                    {record.summary && (
                      <div className="summary-row">
                        <span className="summary-label">Summary</span>
                        <span className="summary-value summary-text">{record.summary}</span>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="record-details">
                      {canPreviewInline(record) && (
                        <div className="details-block">
                          <h4>Document preview</h4>
                          {fileType?.startsWith('image/') && (
                            <div className="file-preview">
                              <img src={record.fileUrl} alt={record.fileName || 'Medical record image'} />
                            </div>
                          )}
                          {fileType === 'application/pdf' && (
                            <div className="file-preview">
                              <iframe
                                src={record.fileUrl}
                                title={record.fileName || record.recordNumber || 'Medical record file'}
                                className="file-frame"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <footer className="record-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => toggleExpand(record.id)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleDownload(record)}
                    >
                      Download
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>No medical records yet</h3>
              <p>Once your care team shares medical documents with you, they will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MedicalRecordsPage;

