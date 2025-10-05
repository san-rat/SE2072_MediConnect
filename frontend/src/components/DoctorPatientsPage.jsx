import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorPatientsPage.css';

const DoctorPatientsPage = ({ user }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      setIsLoading(true);
      try {
        const patientsData = await doctorAPI.getMyPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error('Error loading patients:', error);
        // Fallback to mock data if API fails
        const dummyPatients = [
          {
            id: 1,
            name: 'Alice Johnson',
            age: 34,
            gender: 'Female',
            email: 'alice.johnson@email.com',
            phone: '+1234567890',
            bloodGroup: 'O+',
            lastVisit: '2025-09-20',
            nextAppointment: '2025-10-08',
            medicalHistory: 'Diabetes Type 2, Hypertension',
            emergencyContact: 'John Johnson (+1234567891)',
            status: 'Active'
          },
          {
            id: 2,
            name: 'Bob Williams',
            age: 52,
            gender: 'Male',
            email: 'bob.williams@email.com',
            phone: '+1234567892',
            bloodGroup: 'A+',
            lastVisit: '2025-10-01',
            nextAppointment: null,
            medicalHistory: 'High Cholesterol',
            emergencyContact: 'Mary Williams (+1234567893)',
            status: 'Active'
          },
          {
            id: 3,
            name: 'Charlie Brown',
            age: 28,
            gender: 'Male',
            email: 'charlie.brown@email.com',
            phone: '+1234567894',
            bloodGroup: 'B+',
            lastVisit: '2025-08-15',
            nextAppointment: '2025-10-15',
            medicalHistory: 'None',
            emergencyContact: 'Lucy Brown (+1234567895)',
            status: 'Inactive'
          },
          {
            id: 4,
            name: 'Diana Prince',
            age: 41,
            gender: 'Female',
            email: 'diana.prince@email.com',
            phone: '+1234567896',
            bloodGroup: 'AB+',
            lastVisit: '2025-09-25',
            nextAppointment: '2025-10-12',
            medicalHistory: 'Allergies, Asthma',
            emergencyContact: 'Steve Prince (+1234567897)',
            status: 'Active'
          }
        ];
        setPatients(dummyPatients);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const getFilteredPatients = () => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  };

  const handleStatusChange = (patientId, newStatus) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: newStatus }
        : patient
    ));
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredPatients = getFilteredPatients();

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-patients-page">
          <div className="page-header">
            <h1>My Patients</h1>
            <p>Manage your patient records and medical history</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="controls-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-container">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Patients Grid */}
          <div className="patients-grid">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <div className="patient-avatar">
                      <span className="avatar-text">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="patient-basic-info">
                      <h3>{patient.name}</h3>
                      <p className="patient-age-gender">{patient.age} years, {patient.gender}</p>
                      <p className="patient-contact">{patient.email}</p>
                    </div>
                    <div className="patient-status">
                      <select 
                        value={patient.status}
                        onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                        className={`status-select ${patient.status.toLowerCase()}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="patient-details">
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{patient.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Blood Group:</span>
                      <span className="value">{patient.bloodGroup}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Last Visit:</span>
                      <span className="value">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Next Appointment:</span>
                      <span className="value">
                        {patient.nextAppointment 
                          ? new Date(patient.nextAppointment).toLocaleDateString()
                          : 'Not scheduled'
                        }
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Medical History:</span>
                      <span className="value">{patient.medicalHistory}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Emergency Contact:</span>
                      <span className="value">{patient.emergencyContact}</span>
                    </div>
                  </div>

                  <div className="patient-actions">
                    <button className="btn-primary">View Full Record</button>
                    <button className="btn-secondary">Schedule Appointment</button>
                    <button className="btn-outline">Send Message</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No patients found</h3>
                <p>No patients match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientsPage;