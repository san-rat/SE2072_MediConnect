import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllPatients();
      setPatients(data);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminService.deletePatient(patientId);
        setPatients(patients.filter(patient => patient.id !== patientId));
      } catch (err) {
        setError('Failed to delete patient');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-management">
      <div className="management-header">
        <h3>Patient Management</h3>
        <p>Total Patients: {patients.length}</p>
      </div>

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
                    className="delete-btn"
                    onClick={() => handleDeletePatient(patient.id)}
                  >
                    Delete
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
