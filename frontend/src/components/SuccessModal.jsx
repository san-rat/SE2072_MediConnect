import React from 'react'

const SuccessModal = ({ isOpen, onClose, appointmentDetails }) => {
  if (!isOpen) return null

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Appointment Confirmed!</h2>
          <p className="success-subtitle">Your appointment has been successfully booked</p>
        </div>

        <div className="success-content">
          <div className="appointment-details">
            <h3>Appointment Details</h3>
            <div className="detail-item">
              <span className="detail-label">Doctor:</span>
              <span className="detail-value">{appointmentDetails.doctor.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Specialization:</span>
              <span className="detail-value">{appointmentDetails.doctor.specialization}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(appointmentDetails.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{appointmentDetails.timeSlot.time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Appointment ID:</span>
              <span className="detail-value">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>

          <div className="success-message">
            <p>You will receive a confirmation email shortly. Please arrive 15 minutes before your scheduled time.</p>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
