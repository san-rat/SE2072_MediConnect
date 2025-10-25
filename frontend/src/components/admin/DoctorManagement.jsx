import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        setDeleting(doctorId);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.deleteDoctor(doctorId);
        
        // Show success message
        setSuccessMessage(result.message);
        
        // Remove doctor from list
        setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to delete doctor');
        console.error(err);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="doctor-management">
      <div className="management-header">
        <h3>Doctor Management</h3>
        <p>Total Doctors: {doctors.length}</p>
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
              <th>Specialization</th>
              <th>License Number</th>
              <th>Experience</th>
              <th>Consultation Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.firstName} {doctor.lastName}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.licenseNumber}</td>
                <td>{doctor.yearsExperience} years</td>
                <td>${doctor.consultationFee}</td>
                <td>
                  <button 
                    className={`delete-btn ${deleting === doctor.id ? 'deleting' : ''}`}
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    disabled={deleting === doctor.id}
                  >
                    {deleting === doctor.id ? 'Deleting...' : 'Delete'}
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

export default DoctorManagement;
