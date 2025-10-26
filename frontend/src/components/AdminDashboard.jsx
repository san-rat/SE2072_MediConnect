import { useState, useEffect } from 'react'
import './AdminDashboard.css'
import './admin/AdminManagement.css'
import AdminNotificationsPage from "@/pages/Notification/AdminNotificationsPage.jsx";
import UserManagement from './admin/UserManagement';
import DoctorManagement from './admin/DoctorManagement';
import PatientManagement from './admin/PatientManagement';
import AppointmentManagement from './admin/AppointmentManagement';
import SystemHealth from './admin/SystemHealth';
import Analytics from './admin/Analytics';
import { adminService } from '../services/admin';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, activityData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivity()
      ])
      setStats(statsData)
      setRecentActivity(activityData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'patients', label: 'Patients', icon: '🏥' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' } // 👈 NEW TAB
  ]

  const handleLogout = () => {
    localStorage.removeItem('mc_token')
    localStorage.removeItem('mc_token_type')
    localStorage.removeItem('mc_role')
    onLogout?.()
  }

  const renderOverview = () => (
      <div className="overview-content">
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-info">
                <h3>{stats.totalDoctors}</h3>
                <p>Doctors</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <h3>{stats.totalPatients}</h3>
                <p>Patients</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{stats.totalAppointments}</h3>
                <p>Appointments</p>
              </div>
            </div>
          </div>
        )}

        {/* System Health & Performance */}
        <SystemHealth />

        {/* Charts & Analytics */}
        <Analytics />
      </div>
  )

  const renderNotifications = () => (
      <div className="tab-content">
        <AdminNotificationsPage/>
      </div>
  )


  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'users':
        return <UserManagement />
      case 'doctors':
        return <DoctorManagement />
      case 'patients':
        return <PatientManagement />
      case 'appointments':
        return <AppointmentManagement />
      case 'notifications':
        return renderNotifications()
      default:
        return renderOverview()
    }
  }

  return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="admin-header-content">
            <h1>Admin Dashboard</h1>
            <div className="admin-user-info">
              <span>Welcome, {user?.firstName} {user?.lastName}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              {tabs.map(tab => (
                  <button
                      key={tab.id}
                      className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                  </button>
              ))}
            </nav>
          </div>

          <div className="admin-main">
            {renderTabContent()}
          </div>
        </div>
      </div>
  )
}

export default AdminDashboard
