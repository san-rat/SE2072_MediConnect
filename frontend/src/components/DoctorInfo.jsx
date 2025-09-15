import React from 'react'

const DoctorInfo = ({ doctor }) => {
  if (!doctor) {
    return (
      <div className="doctor-info-placeholder">
        <p>Please select a doctor to view their information</p>
      </div>
    )
  }

  return (
    <div className="doctor-info">
      <div className="doctor-info-header">
        <div className="doctor-avatar-large">
          <img 
            src={doctor.image} 
            alt={doctor.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0c8fad&color=fff&size=120`
            }}
          />
        </div>
        <div className="doctor-info-text">
          <h3 className="doctor-name-large">{doctor.name}</h3>
          <p className="doctor-specialization-large">{doctor.specialization}</p>
          <div className="doctor-stats">
            <span className="stat-item">
              <strong>{doctor.experience}</strong> experience
            </span>
            <span className="stat-item">
              <span className="rating-stars">★★★★★</span>
              <strong>{doctor.rating}</strong> rating
            </span>
          </div>
        </div>
      </div>
      
      <div className="doctor-description">
        <p>{doctor.description}</p>
      </div>
      
      <div className="doctor-actions">
        <button className="btn-secondary btn-view-profile">
          View Profile
        </button>
      </div>
    </div>
  )
}

export default DoctorInfo
