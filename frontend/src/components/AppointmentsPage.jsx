import { useState, useEffect } from 'react'
import './AppointmentsPage.css'
import { api } from '../lib/api'

const AppointmentsPage = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [appointmentNotes, setAppointmentNotes] = useState('')
  
  // Data states
  const [doctors, setDoctors] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [pastAppointments, setPastAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Filter states
  const [specializationFilter, setSpecializationFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Load initial data
  useEffect(() => {
    loadDoctors()
    loadAppointments()
  }, [])

  // Load doctors data
  const loadDoctors = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/doctors')
      setDoctors(response.data)
    } catch (err) {
      setError('Failed to load doctors')
      console.error('Error loading doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load appointments
  const loadAppointments = async () => {
    // Check if user is logged in before trying to load appointments
    const token = localStorage.getItem('mc_token')
    if (!token) {
      console.log('User not logged in, skipping appointment loading')
      setUpcomingAppointments([])
      setPastAppointments([])
      return
    }

    try {
      const [upcomingResponse, historyResponse] = await Promise.all([
        api.get('/api/appointments/upcoming'),
        api.get('/api/appointments/history')
      ])
      setUpcomingAppointments(upcomingResponse.data)
      setPastAppointments(historyResponse.data)
    } catch (err) {
      console.error('Error loading appointments:', err)
      // If 401, user is not authenticated, clear appointments
      if (err.response?.status === 401) {
        setUpcomingAppointments([])
        setPastAppointments([])
        // Clear invalid token
        localStorage.removeItem('mc_token')
        localStorage.removeItem('mc_token_type')
        localStorage.removeItem('mc_role')
      }
    }
  }

  // Load available time slots for selected doctor and date
  const loadAvailableTimeSlots = async (doctorId, date) => {
    try {
      setLoading(true)
      // Convert JavaScript Date to YYYY-MM-DD format
      const dateString = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0')
      console.log('Loading time slots for doctor:', doctorId)
      console.log('Original date:', date)
      console.log('Date string sent to API:', dateString)
      console.log('Date toDateString():', date.toDateString())
      console.log('Date toLocaleDateString():', date.toLocaleDateString())
      const response = await api.get(`/api/appointments/available-slots/${doctorId}?date=${dateString}`)
      console.log('API response:', response.data)
      setAvailableTimeSlots(response.data)
    } catch (err) {
      setError('Failed to load available time slots')
      console.error('Error loading time slots:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialization = !specializationFilter || doctor.specialization === specializationFilter
    const matchesSearch = !searchQuery || 
      doctor.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSpecialization && matchesSearch
  })

  // Get unique specializations for filter
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))]

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setCurrentStep(2)
    setError('')
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    console.log('Selected date:', date)
    console.log('Selected date string:', date.toDateString())
    console.log('Selected date ISO:', date.toISOString())
    setSelectedDate(date)
    if (selectedDoctor) {
      loadAvailableTimeSlots(selectedDoctor.id, date)
    }
    setCurrentStep(3)
    setError('')
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setCurrentStep(4)
    setError('')
  }

  // Handle appointment booking
  const handleBookAppointment = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('mc_token')
    if (!token) {
      setError('Please log in to book an appointment')
      return
    }

    try {
      setLoading(true)
      const appointmentData = {
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate.getFullYear() + '-' + 
          String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(selectedDate.getDate()).padStart(2, '0'), // Convert to YYYY-MM-DD format
        appointmentTime: selectedTimeSlot.startTime,
        notes: appointmentNotes
      }
      
      console.log('Booking appointment with data:', appointmentData)
      await api.post('/api/appointments/book', appointmentData)
      
      // Reset form and reload appointments
      resetForm()
      loadAppointments()
      setError('')
      alert('Appointment booked successfully!')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please log in to book an appointment')
        // Clear invalid token
        localStorage.removeItem('mc_token')
        localStorage.removeItem('mc_token_type')
        localStorage.removeItem('mc_role')
      } else {
        setError('Failed to book appointment. Please try again.')
      }
      console.error('Error booking appointment:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setCurrentStep(1)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setAppointmentNotes('')
    setAvailableTimeSlots([])
  }

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      // Ensure time is set to midnight to avoid timezone issues
      date.setHours(0, 0, 0, 0)
      dates.push(date)
    }
    
    return dates
  }

  // Format date for API
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0]
  }

  // Check if date is available (not in the past and within 1 week)
  const isDateAvailable = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const oneWeekFromNow = new Date(today)
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    
    return date >= today && date <= oneWeekFromNow
  }

  // Render step 1: Doctor selection
  const renderDoctorSelection = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Choose Your Doctor</h2>
        <p>Select a doctor from our available specialists</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Specialization:</label>
          <select 
            value={specializationFilter} 
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="doctor-card-new" onClick={() => handleDoctorSelect(doctor)}>
            <div className="card-header">
              <div className="avatar-container">
                <div className="doctor-avatar">👨‍⚕️</div>
              </div>
              <div className="name-container">
                <h3 className="doctor-name">
                  Dr. {doctor.user?.firstName || doctor.firstName || 'John'} {doctor.user?.lastName || doctor.lastName || 'Doe'}
                </h3>
              </div>
            </div>
            
            <div className="card-content">
              <div className="stats-row">
                <div className="stat-box">
                  <span className="stat-number">{doctor.yearsExperience || 10}</span>
                  <span className="stat-text">Years Experience</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">4.9</span>
                  <span className="stat-text">Rating</span>
                </div>
              </div>
              
              <div className="specialization-badge">
                {doctor.specialization || 'General Medicine'}
              </div>
              
              <div className="fee-section">
                <span className="fee-text">Consultation Fee</span>
                <span className="fee-price">Rs {doctor.consultationFee || 200}</span>
              </div>
              
              <button className="select-btn" onClick={(e) => {
                e.stopPropagation();
                handleDoctorSelect(doctor);
              }}>
                Select Doctor
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="no-results">
          <p>No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  )

  // Render step 2: Date selection
  const renderDateSelection = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Select Date</h2>
        <p>Choose your preferred appointment date</p>
        {selectedDoctor && (
          <div className="selected-doctor">
            <span>Selected: Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}</span>
          </div>
        )}
      </div>

      {/* Modern Calendar Container */}
      <div className="modern-calendar">
        {/* Calendar Header */}
        <div className="calendar-header-modern">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="calendar-nav-btn prev-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <div className="calendar-title">
            <span className="month-name">{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</span>
            <span className="year-number">{currentMonth.getFullYear()}</span>
          </div>
          
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="calendar-nav-btn next-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        {/* Calendar Body */}
        <div className="calendar-body-modern">
          {/* Day Headers */}
          <div className="calendar-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="weekday-header">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Dates Grid */}
          <div className="calendar-dates-modern">
            {generateCalendarDates().map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const isAvailable = isDateAvailable(date)
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <button
                  key={index}
                  className={`calendar-date-modern ${!isCurrentMonth ? 'other-month' : ''} ${!isAvailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => isAvailable && handleDateSelect(date)}
                  disabled={!isAvailable}
                >
                  <span className="date-number">{date.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  // Render step 3: Time selection
  const renderTimeSelection = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Select Time</h2>
        <p>Choose your preferred time slot</p>
        {selectedDoctor && selectedDate && (
          <div className="selected-details">
            <span>Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}</span>
            <span>•</span>
            <span>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric'
            })}</span>
          </div>
        )}
      </div>

      {/* Time Slots Grid */}
      <div className={`time-slots-grid ${loading ? 'loading' : ''}`}>
        {availableTimeSlots.map(timeSlot => (
          <button
            key={timeSlot.id}
            className={`time-slot ${selectedTimeSlot?.id === timeSlot.id ? 'selected' : ''}`}
            onClick={() => handleTimeSlotSelect(timeSlot)}
            disabled={loading}
          >
            <span className="time">{timeSlot.startTime}</span>
            <span className="duration">30 min</span>
          </button>
        ))}
      </div>

      {availableTimeSlots.length === 0 && !loading && (
        <div className="no-slots">
          <p>No available time slots for this date.</p>
          <button onClick={() => setCurrentStep(2)} className="btn btn-outline">
            Choose Different Date
          </button>
        </div>
      )}
    </div>
  )

  // Render step 4: Confirmation
  const renderConfirmation = () => {
    const isLoggedIn = !!localStorage.getItem('mc_token')
    
    return (
      <div className="step-content">
        <div className="step-header">
          <h2>Confirm Appointment</h2>
          <p>Review your appointment details before booking</p>
        </div>

        {/* Login Prompt */}
        {!isLoggedIn && (
          <div className="login-prompt">
            <div className="login-prompt-card">
              <h3>🔐 Login Required</h3>
              <p>You need to log in to book an appointment. Please log in to continue.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {/* Appointment Summary */}
        <div className="appointment-summary">
        <div className="summary-card">
          <h3>Appointment Details</h3>
          <div className="summary-item">
            <span className="label">Doctor:</span>
            <span className="value">{selectedDoctor?.user.firstName} {selectedDoctor?.user.lastName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Specialization:</span>
            <span className="value">{selectedDoctor?.specialization}</span>
          </div>
          <div className="summary-item">
            <span className="label">Date:</span>
            <span className="value">{selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric'
            })}</span>
          </div>
          <div className="summary-item">
            <span className="label">Time:</span>
            <span className="value">{selectedTimeSlot?.startTime} (30 minutes)</span>
          </div>
          <div className="summary-item">
            <span className="label">Consultation Fee:</span>
            <span className="value">Rs {selectedDoctor?.consultationFee}</span>
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <label htmlFor="appointment-notes">Additional Notes (Optional):</label>
          <textarea
            id="appointment-notes"
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
            placeholder="Any additional information for your appointment..."
            rows="4"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="confirmation-actions">
        <button onClick={() => setCurrentStep(3)} className="btn btn-outline">
          ← Back to Time Selection
        </button>
         <button 
           onClick={handleBookAppointment} 
           className="btn btn-primary"
           disabled={loading || !isLoggedIn}
         >
           {loading ? 'Booking...' : 'Confirm & Book Appointment'}
         </button>
       </div>
     </div>
   )
  }

  // Render appointment history
  const renderAppointmentHistory = () => {
    const isLoggedIn = !!localStorage.getItem('mc_token')
    
    if (!isLoggedIn) {
      return (
        <div className="appointment-history">
          <h2>Your Appointments</h2>
          <div className="login-prompt">
            <div className="login-prompt-card">
              <h3>🔐 Login Required</h3>
              <p>Please log in to view your appointment history and upcoming appointments.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="appointment-history">
        <h2>Your Appointments</h2>
        
        {/* Upcoming Appointments */}
        <div className="appointments-section">
          <h3>Upcoming Appointments</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card upcoming">
                  <div className="appointment-header">
                    <h4>{appointment.doctorSpecialization} Consultation</h4>
                    <span className="status upcoming">{appointment.status}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                    <p><strong>Fee:</strong> Rs {appointment.consultationFee}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No upcoming appointments</p>
          )}
        </div>

        {/* Past Appointments */}
        <div className="appointments-section">
          <h3>Appointment History</h3>
          {pastAppointments.length > 0 ? (
            <div className="appointments-list">
              {pastAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card completed">
                  <div className="appointment-header">
                    <h4>{appointment.doctorSpecialization} Consultation</h4>
                    <span className="status completed">{appointment.status}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                    <p><strong>Fee:</strong> Rs {appointment.consultationFee}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No past appointments</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <main className="appointments-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📅 Book Appointment</h1>
          <p>Schedule your medical appointment in just a few simple steps</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Choose Doctor'}
                {step === 2 && 'Select Date'}
                {step === 3 && 'Pick Time'}
                {step === 4 && 'Confirm'}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {currentStep === 1 && renderDoctorSelection()}
          {currentStep === 2 && renderDateSelection()}
          {currentStep === 3 && renderTimeSelection()}
          {currentStep === 4 && renderConfirmation()}
        </div>

        {/* Appointment History */}
        <div className="history-section">
          {renderAppointmentHistory()}
        </div>
      </div>
    </main>
  )
}

export default AppointmentsPage
