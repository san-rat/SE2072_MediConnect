import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DoctorDashboardSidebar.css';

const DoctorDashboardSidebar = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'DB',
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'AP',
      path: '/appointments',
      active: location.pathname === '/appointments'
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: 'PT',
      path: '/patients',
      active: location.pathname === '/patients'
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: 'RX',
      path: '/prescriptions',
      active: location.pathname === '/prescriptions'
    },
    {
      id: 'medical-records',
      label: 'Medical Records',
      icon: 'MR',
      path: '/medical-records',
      active: location.pathname === '/medical-records'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'NT',
      path: '/notifications',
      active: location.pathname === '/notifications'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'PF',
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`doctor-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🏥</span>
          {!isCollapsed && <span className="logo-text">MediConnect</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Doctor Info */}
      <div className="doctor-info">
        <div className="doctor-avatar">
          <span className="avatar-icon">👨‍⚕️</span>
        </div>
        {!isCollapsed && (
          <div className="doctor-details">
            <h3>Dr. {user?.firstName} {user?.lastName}</h3>
            <p className="doctor-specialization">Cardiology</p>
            <p className="doctor-status">Online</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${item.active ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="logout-button"
          onClick={onLogout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DoctorDashboardSidebar;

