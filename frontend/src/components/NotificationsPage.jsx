import './NotificationsPage.css'

const NotificationsPage = () => {
  return (
    <main className="notifications-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🔔 Notifications</h1>
          <p>Stay updated with your medical appointments and health information</p>
        </div>

        <div className="notifications-content">
          <div className="notification-card unread">
            <div className="notification-header">
              <div className="notification-icon">
                <span>📅</span>
              </div>
              <div className="notification-info">
                <h3>Appointment Reminder</h3>
                <p className="notification-time">2 hours ago</p>
              </div>
              <div className="notification-status">
                <span className="unread-dot"></span>
              </div>
            </div>
            <div className="notification-content">
              <p>Test notification</p>
            </div>
            <div className="notification-actions">
              <button className="btn btn-primary">View Details</button>
              <button className="btn btn-outline">Mark as Read</button>
            </div>
          </div>

          <div className="notification-card">
            <div className="notification-header">
              <div className="notification-icon">
                <span>💊</span>
              </div>
              <div className="notification-info">
                <h3>Prescription Ready</h3>
                <p className="notification-time">1 day ago</p>
              </div>
              <div className="notification-status">
                <span className="read-dot"></span>
              </div>
            </div>
            <div className="notification-content">
              <p>Your prescription for Amoxicillin 500mg is ready for pickup at the pharmacy. Please collect it within 3 days.</p>
            </div>
            <div className="notification-actions">
              <button className="btn btn-primary">View Prescription</button>
              <button className="btn btn-outline">Download PDF</button>
            </div>
          </div>

          <div className="notification-card">
            <div className="notification-header">
              <div className="notification-icon">
                <span>🏥</span>
              </div>
              <div className="notification-info">
                <h3>Lab Results Available</h3>
                <p className="notification-time">3 days ago</p>
              </div>
              <div className="notification-status">
                <span className="read-dot"></span>
              </div>
            </div>
            <div className="notification-content">
              <p>Your blood test results from March 15th are now available.</p>
            </div>
            <div className="notification-actions">
              <button className="btn btn-primary">View Results</button>
              <button className="btn btn-outline">Download Report</button>
            </div>
          </div>

          <div className="notification-card">
            <div className="notification-header">
              <div className="notification-icon">
                <span>💰</span>
              </div>
              <div className="notification-info">
                <h3>Payment Confirmation</h3>
                <p className="notification-time">1 week ago</p>
              </div>
              <div className="notification-status">
                <span className="read-dot"></span>
              </div>
            </div>
            <div className="notification-content">
              <p>Your payment of Rs 150 for the consultation fee has been processed successfully. Thank you for your payment.</p>
            </div>
            <div className="notification-actions">
              <button className="btn btn-primary">View Receipt</button>
              <button className="btn btn-outline">Download Invoice</button>
            </div>
          </div>

          <div className="no-notifications">
            <div className="no-notifications-content">
              <span className="icon">🔔</span>
              <h3>All Caught Up!</h3>
              <p>You have no new notifications at this time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotificationsPage
