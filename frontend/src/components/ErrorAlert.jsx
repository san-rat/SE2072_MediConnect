import React from 'react'

const ErrorAlert = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="error-alert">
      <div className="error-content">
        <div className="error-icon">❌</div>
        <div className="error-message">
          <h4>Booking Failed</h4>
          <p>{message}</p>
        </div>
        <button className="error-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}

export default ErrorAlert
