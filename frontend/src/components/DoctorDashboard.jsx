import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import DoctorAnalytics from './doctor/DoctorAnalytics';
import DoctorSystemHealth from './doctor/DoctorSystemHealth';
import { doctorAPI } from '../services/doctor';
import './DoctorDashboard.css';

const DoctorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch comprehensive real data from backend
        const data = await doctorAPI.getComprehensiveDashboardData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData(null);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'health', label: 'System Health', icon: '🏥' }
  ];

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

  const renderOverview = () => (
    <div className="overview-content">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome back, Dr. {user?.firstName} {user?.lastName}</p>
        <button 
          className="refresh-btn" 
          onClick={() => window.location.reload()}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{dashboardData?.totalAppointments || 0}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{dashboardData?.todayAppointments || 0}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{dashboardData?.totalPatients || 0}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>{dashboardData?.pendingPrescriptions || 0}</h3>
            <p>Pending Prescriptions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{dashboardData?.totalMedicalRecords || 0}</h3>
            <p>Medical Records</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{dashboardData?.completedAppointments || 0}</h3>
            <p>Completed Appointments</p>
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {(!dashboardData || dashboardData.totalAppointments === 0) && (
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

      {/* Recent Appointments */}
      {dashboardData?.recentAppointments && dashboardData.recentAppointments.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <button className="btn-secondary" onClick={() => navigate('/appointments')}>View All</button>
          </div>
          <div className="appointments-list">
            {dashboardData.recentAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-time">
                  <span className="time">{appointment.time || 'N/A'}</span>
                  <span className={`status ${(appointment.status || '').toLowerCase()}`}>
                    {appointment.status || 'Unknown'}
                  </span>
                </div>
                <div className="appointment-details">
                  <h4>{appointment.patientName || 'Unknown Patient'}</h4>
                  <p>{appointment.type || 'Consultation'}</p>
                </div>
                <div className="appointment-actions">
                  <button className="btn-primary" onClick={() => navigate('/appointments')}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => navigate('/appointments')}>
            <span className="action-icon">📅</span>
            <span className="action-text">View Appointments</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/patients')}>
            <span className="action-icon">👥</span>
            <span className="action-text">Manage Patients</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/prescriptions')}>
            <span className="action-icon">💊</span>
            <span className="action-text">Create Prescription</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/medical-records')}>
            <span className="action-icon">📋</span>
            <span className="action-text">Medical Records</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return <DoctorAnalytics />;
      case 'health':
        return <DoctorSystemHealth />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;