import React, { useState } from 'react'
import DoctorSelection from './DoctorSelection'
import DoctorInfo from './DoctorInfo'
import DatePicker from './DatePicker'
import TimeSlotPicker from './TimeSlotPicker'
import SuccessModal from './SuccessModal'
import ErrorAlert from './ErrorAlert'

const BookingPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    // Reset date and time when doctor changes
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    // Reset time slot when date changes
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      setErrorMessage('Please select a doctor, date, and time slot to book your appointment.')
      setShowErrorAlert(true)
      return
    }

    setIsBooking(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        setShowSuccessModal(true)
      } else {
        throw new Error('Unable to book appointment at this time. Please try again.')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setShowErrorAlert(true)
    } finally {
      setIsBooking(false)
    }
  }

  const handleCancelBooking = () => {
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    // Reset the entire booking flow
    handleCancelBooking()
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage('')
  }

  const appointmentDetails = {
    doctor: selectedDoctor,
    date: selectedDate,
    timeSlot: selectedTimeSlot
  }

  return (
    <div className="booking-page">
      {/* Header Section */}
      <header className="header">
        <h1>MediConnect</h1>
        <p>Smart Healthcare Management System</p>
      </header>

      {/* Main Booking Container */}
      <div className="booking-container">
        <div className="booking-header">
          <h2 className="booking-title">Book Your Appointment</h2>
          <p className="booking-subtitle">
            Schedule your medical consultation with our qualified healthcare professionals
          </p>
        </div>

        {/* Booking Steps */}
        <div className="booking-content">
          {/* Step 1: Doctor Selection */}
          <div className="booking-step">
            <h3 className="step-title">Step 1: Select Your Doctor</h3>
            <p className="step-description">
              Choose from our qualified healthcare professionals
            </p>
            
            <DoctorSelection 
              onDoctorSelect={handleDoctorSelect}
              selectedDoctor={selectedDoctor}
            />
          </div>

          {/* Doctor Information Display */}
          {selectedDoctor && (
            <div className="booking-step">
              <h3 className="step-title">Doctor Information</h3>
              <DoctorInfo doctor={selectedDoctor} />
            </div>
          )}

          {/* Step 2: Date Selection */}
          {selectedDoctor && (
            <div className="booking-step">
              <h3 className="step-title">Step 2: Select Date</h3>
              <p className="step-description">
                Choose your preferred appointment date
              </p>
              
              <DatePicker 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          )}

          {/* Step 3: Time Selection */}
          {selectedDate && (
            <div className="booking-step">
              <h3 className="step-title">Step 3: Select Time</h3>
              <p className="step-description">
                Choose your preferred appointment time
              </p>
              
              <TimeSlotPicker 
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={handleTimeSlotSelect}
                doctorId={selectedDoctor?.id}
              />
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {selectedDoctor && selectedDate && selectedTimeSlot && (
            <div className="booking-step booking-confirmation">
              <h3 className="step-title">Step 4: Confirm Booking</h3>
              <div className="booking-summary">
                <div className="summary-item">
                  <strong>Doctor:</strong> {selectedDoctor.name} - {selectedDoctor.specialization}
                </div>
                <div className="summary-item">
                  <strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="summary-item">
                  <strong>Time:</strong> {selectedTimeSlot.time}
                </div>
              </div>
              
              <div className="booking-actions">
                <button 
                  className="btn-primary btn-confirm"
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Confirming...
                    </>
                  ) : (
                    'Confirm Appointment'
                  )}
                </button>
                <button 
                  className="btn-secondary btn-cancel"
                  onClick={handleCancelBooking}
                  disabled={isBooking}
                >
                  Cancel & Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        appointmentDetails={appointmentDetails}
      />

      {/* Error Alert */}
      <ErrorAlert 
        isVisible={showErrorAlert}
        message={errorMessage}
        onClose={handleCloseErrorAlert}
      />
    </div>
  )
}

export default BookingPage
