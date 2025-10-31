import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import { notificationService } from '../services/notificationService';
import './DoctorNotificationsPage.css';

const DoctorNotificationsPage = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!user || !user.id) {
          console.error("Doctor user ID not found");
          setNotifications([]);
          return;
        }

        const data = await notificationService.getNotifications(user.id);

        // Normalize the notification data for consistent display
        const formatted = data.map(n => ({
          id: n.id,
          type: n.type || 'general',
          title: n.title || 'Notification',
          message: n.message || '',
          timestamp: n.timestamp || n.createdAt || new Date().toISOString(),
          isRead: n.read || false,
          priority: n.priority || 'low',
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications.");
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

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
        return notifications.filter(n => !n.isRead);
      case 'appointment':
        return notifications.filter(n => n.type === 'appointment');
      case 'prescription':
        return notifications.filter(n => n.type === 'prescription');
      case 'system':
        return notifications.filter(n => n.type === 'system');
      case 'patient':
        return notifications.filter(n => n.type === 'patient');
      default:
        return notifications;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
          notifications.filter(n => !n.isRead).map(n =>
              notificationService.markAsRead(n.id)
          )
      );
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
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
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
              {['all', 'unread', 'appointment', 'prescription', 'system'].map(f => (
                  <button
                      key={f}
                      className={`filter-tab ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)} (
                    {f === 'all'
                        ? notifications.length
                        : f === 'unread'
                            ? unreadCount
                            : notifications.filter(n => n.type === f).length}
                    )
                  </button>
              ))}
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

            {/* Error or Notifications */}
            {error ? (
                <div className="error-state">
                  <p>{error}</p>
                </div>
            ) : (
                <div className="notifications-container">
                  {filteredNotifications.length > 0 ? (
                      filteredNotifications.map(n => (
                          <div
                              key={n.id}
                              className={`notification-card ${!n.isRead ? 'unread' : ''}`}
                              onClick={() => markAsRead(n.id)}
                          >
                            <div className="notification-header">
                              <div className="notification-icon">
                                <span>{getTypeIcon(n.type)}</span>
                              </div>
                              <div className="notification-content">
                                <h3>{n.title}</h3>
                                <p>{n.message}</p>
                              </div>
                              <div className="notification-meta">
                                <div
                                    className="priority-indicator"
                                    style={{ backgroundColor: getPriorityColor(n.priority) }}
                                ></div>
                                <span className="timestamp">
                          {new Date(n.timestamp).toLocaleString()}
                        </span>
                              </div>
                            </div>
                            {!n.isRead && <div className="unread-indicator"></div>}
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
            )}
          </div>
        </div>
      </div>
  );
};

export default DoctorNotificationsPage;
