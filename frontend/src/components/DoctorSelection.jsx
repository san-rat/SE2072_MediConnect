import React, { useState, useEffect, useRef } from 'react'
import { doctors, specializations } from '../data/doctors'

const DoctorSelection = ({ onDoctorSelect, selectedDoctor }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Filter doctors based on specialization and search term
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization
    const matchesSearch = !searchTerm || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSpecialization && matchesSearch
  })

  const handleDoctorClick = (doctor) => {
    onDoctorSelect(doctor)
    setShowDropdown(false)
    setSearchTerm('')
  }

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="doctor-selection">
      {/* Specialization Filter */}
      <div className="form-group">
        <label htmlFor="specialization" className="form-label">
          Filter by Specialization
        </label>
        <select
          id="specialization"
          value={selectedSpecialization}
          onChange={handleSpecializationChange}
          className="form-select"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Doctor Search */}
      <div className="form-group search-group">
        <label htmlFor="doctor-search" className="form-label">
          Search Doctors
        </label>
        <div className="search-container">
          <input
            id="doctor-search"
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="form-input"
          />
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="dropdown-toggle"
          >
            ▼
          </button>
          
          {/* Doctor Dropdown - positioned directly under search */}
          {showDropdown && (
            <div className="doctor-dropdown" ref={dropdownRef}>
              {filteredDoctors.length > 0 ? (
                <div className="doctor-list">
                  {filteredDoctors.map(doctor => (
                    <div
                      key={doctor.id}
                      className="doctor-item"
                      onClick={() => handleDoctorClick(doctor)}
                    >
                      <div className="doctor-avatar">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0c8fad&color=fff&size=40`
                          }}
                        />
                      </div>
                      <div className="doctor-details">
                        <h4 className="doctor-name">{doctor.name}</h4>
                        <p className="doctor-specialization">{doctor.specialization}</p>
                        <div className="doctor-rating">
                          <span className="rating-stars">★★★★★</span>
                          <span className="rating-value">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No doctors found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorSelection
