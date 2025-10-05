import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorNotificationsPage.css';

const DoctorNotificationsPage = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const notificationsData = await doctorAPI.getMyNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Fallback to mock data if API fails
        const dummyNotifications = [
          {
            id: 1,
            type: 'appointment',
            title: 'New Appointment Request',
            message: 'John Smith has requested an appointment for tomorrow at 2:00 PM',
            timestamp: '2025-10-04T10:30:00Z',
            isRead: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'prescription',
            title: 'Prescription Refill Request',
            message: 'Alice Johnson needs a refill for her blood pressure medication',
            timestamp: '2025-10-04T09:15:00Z',
            isRead: false,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
            timestamp: '2025-10-04T08:00:00Z',
            isRead: true,
            priority: 'low'
          },
          {
            id: 4,
            type: 'appointment',
            title: 'Appointment Cancelled',
            message: 'Bob Williams has cancelled his appointment for today at 3:00 PM',
            timestamp: '2025-10-04T07:45:00Z',
            isRead: true,
            priority: 'medium'
          },
          {
            id: 5,
            type: 'patient',
            title: 'Patient Update',
            message: 'Diana Prince has updated her medical history',
            timestamp: '2025-10-03T16:20:00Z',
            isRead: true,
            priority: 'low'
          }
        ];
        setNotifications(dummyNotifications);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead);
      case 'appointment':
        return notifications.filter(notif => notif.type === 'appointment');
      case 'prescription':
        return notifications.filter(notif => notif.type === 'prescription');
      case 'system':
        return notifications.filter(notif => notif.type === 'system');
      case 'patient':
        return notifications.filter(notif => notif.type === 'patient');
      default:
        return notifications;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'prescription': return '💊';
      case 'system': return '⚙️';
      case 'patient': return '👤';
      default: return '🔔';
    }
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-notifications-page">
          <div className="page-header">
            <h1>Notifications</h1>
            <p>Stay updated with your practice activities</p>
            {unreadCount > 0 && (
              <div className="unread-badge">
                {unreadCount} unread
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={`filter-tab ${filter === 'appointment' ? 'active' : ''}`}
              onClick={() => setFilter('appointment')}
            >
              Appointments ({notifications.filter(n => n.type === 'appointment').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'prescription' ? 'active' : ''}`}
              onClick={() => setFilter('prescription')}
            >
              Prescriptions ({notifications.filter(n => n.type === 'prescription').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
              onClick={() => setFilter('system')}
            >
              System ({notifications.filter(n => n.type === 'system').length})
            </button>
          </div>

          {/* Actions */}
          <div className="notifications-actions">
            <button 
              className="btn-secondary"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </button>
          </div>

          {/* Notifications List */}
          <div className="notifications-container">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <div className="notification-icon">
                      <span>{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="notification-content">
                      <h3>{notification.title}</h3>
                      <p>{notification.message}</p>
                    </div>
                    <div className="notification-meta">
                      <div 
                        className="priority-indicator"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      ></div>
                      <span className="timestamp">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <h3>No notifications found</h3>
                <p>No notifications match your current filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotificationsPage;
