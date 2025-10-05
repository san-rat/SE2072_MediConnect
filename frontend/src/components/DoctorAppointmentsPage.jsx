import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorAppointmentsPage.css';

const DoctorAppointmentsPage = ({ user }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const appointmentsData = await doctorAPI.getMyAppointments();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading appointments:', error);
        // Fallback to mock data if API fails
        setAppointments([
        {
          id: 1,
          patientName: 'John Smith',
          patientEmail: 'john.smith@email.com',
          patientPhone: '+1234567890',
          date: '2025-10-04',
          time: '09:00 AM',
          type: 'Follow-up',
          status: 'Confirmed',
          reason: 'Diabetes management',
          notes: 'Patient responding well to treatment'
        },
        {
          id: 2,
          patientName: 'Sarah Johnson',
          patientEmail: 'sarah.j@email.com',
          patientPhone: '+1234567891',
          date: '2025-10-04',
          time: '10:30 AM',
          type: 'New Patient',
          status: 'Pending',
          reason: 'General consultation',
          notes: 'First visit - comprehensive checkup needed'
        },
        {
          id: 3,
          patientName: 'Mike Wilson',
          patientEmail: 'mike.w@email.com',
          patientPhone: '+1234567892',
          date: '2025-10-04',
          time: '02:00 PM',
          type: 'Consultation',
          status: 'Confirmed',
          reason: 'Blood pressure check',
          notes: 'Regular monitoring'
        },
        {
          id: 4,
          patientName: 'Emily Davis',
          patientEmail: 'emily.d@email.com',
          patientPhone: '+1234567893',
          date: '2025-10-05',
          time: '11:00 AM',
          type: 'Follow-up',
          status: 'Confirmed',
          reason: 'Cardiology review',
          notes: 'Post-surgery follow-up'
        }
      ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
      case 'today':
        return appointments.filter(apt => apt.date === today);
      case 'upcoming':
        return appointments.filter(apt => apt.date >= today);
      case 'all':
        return appointments;
      default:
        return appointments;
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      // You could show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-appointments-page">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Manage your patient appointments and schedule</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today ({appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({appointments.filter(apt => apt.date >= new Date().toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Appointments ({appointments.length})
            </button>
          </div>

          {/* Appointments List */}
          <div className="appointments-container">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-time">
                      <span className="time">{appointment.time}</span>
                      <span className="date">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="appointment-status">
                      <select 
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`status-select ${appointment.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="appointment-content">
                    <div className="patient-info">
                      <h3>{appointment.patientName}</h3>
                      <p className="patient-contact">{appointment.patientEmail}</p>
                      <p className="patient-contact">{appointment.patientPhone}</p>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">{appointment.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Reason:</span>
                        <span className="value">{appointment.reason}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Notes:</span>
                        <span className="value">{appointment.notes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="appointment-actions">
                    <button className="btn-primary">View Details</button>
                    <button className="btn-secondary">Start Consultation</button>
                    <button className="btn-outline">Reschedule</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No appointments found</h3>
                <p>No appointments match your current filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
