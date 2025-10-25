import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        setDeleting(patientId);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.deletePatient(patientId);
        
        // Show success message
        setSuccessMessage(result.message);
        
        // Remove patient from list
        setPatients(patients.filter(patient => patient.id !== patientId));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to delete patient');
        console.error(err);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div className="patient-management">
      <div className="management-header">
        <h3>Patient Management</h3>
        <p>Total Patients: {patients.length}</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Emergency Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{patient.email}</td>
                <td>{patient.phone || 'N/A'}</td>
                <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                <td>{patient.emergencyContact || 'N/A'}</td>
                <td>
                  <button 
                    className={`delete-btn ${deleting === patient.id ? 'deleting' : ''}`}
                    onClick={() => handleDeletePatient(patient.id)}
                    disabled={deleting === patient.id}
                  >
                    {deleting === patient.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientManagement;
