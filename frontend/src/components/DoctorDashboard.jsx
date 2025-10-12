import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import { doctorAPI } from '../services/doctor';
import './DoctorDashboard.css';

const DoctorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch real data from backend
        const dashboardData = await doctorAPI.getDashboardStats();
        
        setStats({
          totalAppointments: dashboardData.totalAppointments || 0,
          todayAppointments: dashboardData.todayAppointments || 0,
          totalPatients: dashboardData.totalPatients || 0,
          pendingPrescriptions: dashboardData.pendingPrescriptions || 0
        });

        // Set recent appointments from backend data
        setRecentAppointments(dashboardData.recentAppointments || []);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        
        // Fallback to sample data if API fails or returns empty data
        setStats({
          totalAppointments: 0,
          todayAppointments: 0,
          totalPatients: 0,
          pendingPrescriptions: 0
        });

        setRecentAppointments([]);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Doctor Dashboard</h1>
          <p>Welcome back, Dr. {user?.firstName} {user?.lastName}</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.totalAppointments}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.todayAppointments}</h3>
              <p>Today's Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPatients}</h3>
              <p>Total Patients</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💊</div>
            <div className="stat-content">
              <h3>{stats.pendingPrescriptions}</h3>
              <p>Pending Prescriptions</p>
            </div>
          </div>
        </div>

        {/* No Data Message */}
        {stats.totalAppointments === 0 && (
          <div className="no-data-message">
            <div className="no-data-icon">📊</div>
            <h3>Welcome to Your Dashboard!</h3>
            <p>Your dashboard is connected to the backend and ready to show real data. Currently, you don't have any appointments or patients yet.</p>
            <div className="no-data-actions">
              <button className="btn-primary" onClick={() => navigate('/appointments')}>
                View Appointments
              </button>
              <button className="btn-secondary" onClick={() => navigate('/patients')}>
                View Patients
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Recent Appointments */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Today's Appointments</h2>
              <button className="btn-secondary" onClick={() => navigate('/appointments')}>View All</button>
            </div>
            <div className="appointments-list">
              {recentAppointments.length > 0 ? (
                recentAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <span className="time">{appointment.time}</span>
                      <span className={`status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <h4>{appointment.patientName}</h4>
                      <p>{appointment.type}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-primary" onClick={() => navigate('/appointments')}>View</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => navigate('/prescriptions')}>
                <span className="action-icon">📝</span>
                <span>Write Prescription</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/appointments')}>
                <span className="action-icon">📅</span>
                <span>Schedule Appointment</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/patients')}>
                <span className="action-icon">👥</span>
                <span>View Patients</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/notifications')}>
                <span className="action-icon">📊</span>
                <span>View Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;