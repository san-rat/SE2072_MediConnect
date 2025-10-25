import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminService.deleteDoctor(doctorId);
        setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      } catch (err) {
        setError('Failed to delete doctor');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="doctor-management">
      <div className="management-header">
        <h3>Doctor Management</h3>
        <p>Total Doctors: {doctors.length}</p>
      </div>

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
                    className="delete-btn"
                    onClick={() => handleDeleteDoctor(doctor.id)}
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

export default DoctorManagement;
