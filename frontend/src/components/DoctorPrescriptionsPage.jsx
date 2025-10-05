import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorPrescriptionsPage.css';

const DoctorPrescriptionsPage = ({ user }) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrescriptions = async () => {
      setIsLoading(true);
      try {
        const prescriptionsData = await doctorAPI.getMyPrescriptions();
        setPrescriptions(prescriptionsData);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
        // Fallback to mock data if API fails
      
      // Mock data for doctor's prescriptions
      setPrescriptions([
        {
          id: 1,
          prescriptionNumber: 'RX-2025-001',
          patientName: 'John Smith',
          patientEmail: 'john.smith@email.com',
          date: '2025-10-04',
          status: 'Active',
          medications: [
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
          ],
          instructions: 'Take with food. Monitor blood sugar levels regularly.',
          notes: 'Patient responding well to current treatment plan'
        },
        {
          id: 2,
          prescriptionNumber: 'RX-2025-002',
          patientName: 'Sarah Johnson',
          patientEmail: 'sarah.j@email.com',
          date: '2025-10-03',
          status: 'Completed',
          medications: [
            { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', duration: '60 days' }
          ],
          instructions: 'Use inhaler before exercise or when experiencing shortness of breath.',
          notes: 'Patient has shown improvement in asthma symptoms'
        },
        {
          id: 3,
          prescriptionNumber: 'RX-2025-003',
          patientName: 'Mike Wilson',
          patientEmail: 'mike.w@email.com',
          date: '2025-10-02',
          status: 'Pending',
          medications: [
            { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }
          ],
          instructions: 'Take at the same time each day. Regular blood pressure monitoring required.',
          notes: 'New prescription for cholesterol and blood pressure management'
        },
        {
          id: 4,
          prescriptionNumber: 'RX-2025-004',
          patientName: 'Emily Davis',
          patientEmail: 'emily.d@email.com',
          date: '2025-10-01',
          status: 'Active',
          medications: [
            { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '90 days' }
          ],
          instructions: 'Take at the first sign of migraine. Maximum 2 tablets per day.',
          notes: 'Patient reports reduced frequency of migraines'
        }
      ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || prescription.status.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  };

  const handleStatusChange = (prescriptionId, newStatus) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === prescriptionId 
          ? { ...prescription, status: newStatus }
          : prescription
      )
    );
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredPrescriptions = getFilteredPrescriptions();

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-prescriptions-page">
          <div className="page-header">
            <h1>Prescriptions</h1>
            <p>Manage patient prescriptions and medication records</p>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by patient name or prescription number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Prescriptions</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="prescriptions-container">
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-card">
              <div className="prescription-header">
                <div className="prescription-info">
                  <h3>Prescription #{prescription.prescriptionNumber}</h3>
                  <p className="prescription-date">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
                <div className="prescription-status">
                  <select 
                    value={prescription.status}
                    onChange={(e) => handleStatusChange(prescription.id, e.target.value)}
                    className={`status-select ${prescription.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="patient-info">
                <h4>{prescription.patientName}</h4>
                <p>{prescription.patientEmail}</p>
              </div>

              <div className="medications-section">
                <h5>Medications:</h5>
                <div className="medications-list">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <div className="medication-name">{med.name}</div>
                      <div className="medication-details">
                        <span>{med.dosage}</span>
                        <span>•</span>
                        <span>{med.frequency}</span>
                        <span>•</span>
                        <span>{med.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="instructions-section">
                <h5>Instructions:</h5>
                <p>{prescription.instructions}</p>
              </div>

              <div className="notes-section">
                <h5>Notes:</h5>
                <p>{prescription.notes}</p>
              </div>

              <div className="prescription-actions">
                <button className="btn-primary">View Details</button>
                <button className="btn-secondary">Edit Prescription</button>
                <button className="btn-outline">Print</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
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
