import './AppointmentsPage.css'

const AppointmentsPage = () => {
  return (
    <main className="appointments-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📅 Appointments</h1>
          <p>Schedule and manage your medical appointments</p>
        </div>

        <div className="appointments-content">
          <div className="appointment-card upcoming">
            <div className="appointment-header">
              <h3>Cardiology Consultation</h3>
              <span className="status upcoming">Upcoming</span>
            </div>
            <div className="appointment-details">
              <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
              <p><strong>Date:</strong> March 25, 2024</p>
              <p><strong>Time:</strong> 10:30 AM</p>
              <p><strong>Location:</strong> Room 205, Cardiology Department</p>
            </div>
            <div className="appointment-actions">
              <button className="btn btn-primary">View Details</button>
              <button className="btn btn-outline">Reschedule</button>
              <button className="btn btn-danger">Cancel</button>
            </div>
          </div>

          <div className="appointment-card completed">
            <div className="appointment-header">
              <h3>General Checkup</h3>
              <span className="status completed">Completed</span>
            </div>
            <div className="appointment-details">
              <p><strong>Doctor:</strong> Dr. Michael Chen</p>
              <p><strong>Date:</strong> March 15, 2024</p>
              <p><strong>Time:</strong> 2:00 PM</p>
              <p><strong>Location:</strong> Room 101, General Medicine</p>
            </div>
            <div className="appointment-actions">
              <button className="btn btn-primary">View Report</button>
              <button className="btn btn-outline">Download Summary</button>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="btn btn-primary btn-large">
                <span className="btn-icon">📅</span>
                Book New Appointment
              </button>
              <button className="btn btn-outline btn-large">
                <span className="btn-icon">🔄</span>
                Reschedule Appointment
              </button>
              <button className="btn btn-outline btn-large">
                <span className="btn-icon">📋</span>
                View Medical History
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AppointmentsPage
