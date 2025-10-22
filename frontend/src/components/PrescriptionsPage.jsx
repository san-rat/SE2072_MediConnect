import { useEffect, useMemo, useState } from 'react';
import { getMyPrescriptions } from '../services/patient';
import downloadFile from '../utils/downloadFile';
import './PrescriptionsPage.css';

const fallbackPrescriptions = [
  {
    id: 'RX-2025-001',
    prescriptionNumber: 'RX-2025-001',
    doctorName: 'S. Jayasinghe',
    facilityName: 'MediConnect General Hospital',
    date: '2025-10-03',
    validUntil: '2025-11-03',
    medications: [
      { name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times daily', duration: '7 days' }
    ],
    instructions: 'Take Amoxicillin with food and drink plenty of water.',
    notes: 'Report if you develop any rash or breathing difficulty.',
    fileName: 'sample-prescription.pdf',
    fileType: 'application/pdf',
    fileUrl: '/mock-prescriptions/sample-prescription.pdf'
  },
  {
    id: 'RX-2025-002',
    prescriptionNumber: 'RX-2025-002',
    doctorName: 'M. Fernando',
    facilityName: 'Wellness Plus Family Practice',
    date: '2025-09-20',
    validUntil: '2025-11-20',
    medications: [
      { name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', duration: '60 days' }
    ],
    instructions: 'Take with a meal that contains healthy fats to improve absorption.',
    notes: 'Follow-up consultation scheduled for mid-November.',
    fileName: 'sample-prescription.png',
    fileType: 'image/png',
    fileUrl: '/mock-prescriptions/sample-prescription.png'
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

const deriveFileType = (prescription) => {
  if (prescription.fileType) {
    return prescription.fileType;
  }

  const name = prescription.fileName?.toLowerCase() ?? '';
  if (name.endsWith('.pdf')) {
    return 'application/pdf';
  }
  if (name.endsWith('.png')) {
    return 'image/png';
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  return undefined;
};

const hasPreview = (prescription) => {
  const fileType = deriveFileType(prescription);
  if (!prescription.fileUrl || !fileType) {
    return false;
  }
  return fileType === 'application/pdf' || fileType.startsWith('image/');
};

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMessage, setBannerMessage] = useState('');

  useEffect(() => {
    const loadPrescriptions = async () => {
      setIsLoading(true);
      setBannerMessage('');

      try {
        const data = await getMyPrescriptions();
        const parsed = Array.isArray(data) ? data : [];
        const withIds = parsed.map((item, index) => ({
          ...item,
          id: item.id ?? item.prescriptionNumber ?? `prescription-${index}`
        }));
        setPrescriptions(withIds);
      } catch (error) {
        console.error('Error loading patient prescriptions:', error);
        setBannerMessage('We could not reach the prescription service. Showing the most recent records available.');
        setPrescriptions(fallbackPrescriptions);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  const sortedPrescriptions = useMemo(() => {
    return [...prescriptions].sort((a, b) => {
      const aDate = new Date(a.date || 0).getTime();
      const bDate = new Date(b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [prescriptions]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDownload = async (prescription) => {
    if (prescription.fileUrl) {
      try {
        await downloadFile({
          url: prescription.fileUrl,
          fileName: prescription.fileName,
          fallbackName: prescription.prescriptionNumber || 'prescription'
        });
        return;
      } catch (error) {
        console.error('Unable to download prescription file', error);
      }
    }

    try {
      const fallbackName = `${prescription.prescriptionNumber || 'prescription'}.json`;
      const serialised = JSON.stringify(prescription, null, 2);
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
      console.error('Unable to create fallback download', error);
    }
  };

  return (
    <main className="prescriptions-page">
      <div className="page-container">
        <div className="page-header">
          <h1>My Prescriptions</h1>
          <p>Access, review, and download the prescriptions that have been issued to you.</p>
        </div>

        {bannerMessage && (
          <div className="info-banner" role="status">{bannerMessage}</div>
        )}

        {isLoading ? (
          <div className="state-card">Loading prescriptions...</div>
        ) : sortedPrescriptions.length > 0 ? (
          <div className="prescriptions-content">
            {sortedPrescriptions.map((prescription) => {
              const isExpanded = expandedId === prescription.id;
              const fileType = deriveFileType(prescription);

              return (
                <article key={prescription.id} className={`prescription-card ${isExpanded ? 'expanded' : ''}`}>
                  <header className="prescription-header">
                    <div>
                      <h3>Prescription #{prescription.prescriptionNumber || 'Pending assignment'}</h3>
                      <div className="prescription-meta">
                        <span>{formatDate(prescription.date)}</span>
                        {prescription.facilityName && <span className="meta-divider">|</span>}
                        {prescription.facilityName && <span>{prescription.facilityName}</span>}
                      </div>
                    </div>
                  </header>

                  <div className="prescription-summary">
                    <div className="summary-row">
                      <span className="summary-label">Prescribed by</span>
                      <span className="summary-value">{prescription.doctorName || 'Not available'}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Valid until</span>
                      <span className="summary-value">{formatDate(prescription.validUntil)}</span>
                    </div>
                    {prescription.fileName && (
                      <div className="summary-row">
                        <span className="summary-label">Document</span>
                        <span className="summary-value">{prescription.fileName}</span>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="prescription-details">
                      <div className="details-block">
                        <h4>Medications</h4>
                        <ul className="medications-list">
                          {(prescription.medications || []).map((medication, index) => (
                            <li key={`${prescription.id}-med-${index}`}>
                              <span className="medication-name">{medication.name}</span>
                              <span className="medication-attributes">
                                {medication.dosage && <span>{medication.dosage}</span>}
                                {medication.frequency && <span>{medication.frequency}</span>}
                                {medication.duration && <span>{medication.duration}</span>}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {hasPreview(prescription) && (
                        <div className="details-block">
                          <h4>Prescription file</h4>
                          {fileType?.startsWith('image/') && (
                            <div className="file-preview" role="img" aria-label={`Preview of ${prescription.fileName || 'prescription file'}`}>
                              <img src={prescription.fileUrl} alt={prescription.fileName || 'Prescription image'} />
                            </div>
                          )}
                          {fileType === 'application/pdf' && (
                            <div className="file-preview">
                              <iframe
                                src={prescription.fileUrl}
                                title={prescription.fileName || prescription.prescriptionNumber || 'Prescription file'}
                                className="file-frame"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {prescription.instructions && (
                        <div className="details-block">
                          <h4>Instructions</h4>
                          <p>{prescription.instructions}</p>
                        </div>
                      )}

                      {prescription.notes && (
                        <div className="details-block">
                          <h4>Additional notes</h4>
                          <p>{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <footer className="prescription-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => toggleExpand(prescription.id)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleDownload(prescription)}
                    >
                      Download
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-prescriptions">
            <div className="no-prescriptions-content">
              <h3>No prescriptions yet</h3>
              <p>Prescriptions that are issued to you will appear here. If you were expecting one, please contact your clinic.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PrescriptionsPage;

