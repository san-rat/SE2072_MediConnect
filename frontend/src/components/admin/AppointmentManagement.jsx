import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        setDeleting(appointmentId);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.deleteAppointment(appointmentId);
        
        // Show success message
        setSuccessMessage(result.message);
        
        // Remove appointment from list
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to delete appointment');
        console.error(err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="appointment-management">
      <div className="management-header">
        <h3>Appointment Management</h3>
        <p>Total Appointments: {appointments.length}</p>
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
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patientName || 'N/A'}</td>
                <td>{appointment.doctorName || 'N/A'}</td>
                <td>
                  {new Date(appointment.appointmentTime).toLocaleDateString()} at {' '}
                  {new Date(appointment.appointmentTime).toLocaleTimeString()}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>{appointment.type || 'N/A'}</td>
                <td>{appointment.notes || 'N/A'}</td>
                <td>
                  <button 
                    className={`delete-btn ${deleting === appointment.id ? 'deleting' : ''}`}
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    disabled={deleting === appointment.id}
                  >
                    {deleting === appointment.id ? 'Deleting...' : 'Delete'}
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

export default AppointmentManagement;
