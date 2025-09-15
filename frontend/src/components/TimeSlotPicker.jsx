import React, { useState, useEffect } from 'react'

const TimeSlotPicker = ({ selectedDate, selectedTimeSlot, onTimeSlotSelect, doctorId }) => {
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(false)

  // Generate time slots for the day
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM
    const slotDuration = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotDuration) {
        const time = new Date()
        time.setHours(hour, minutes, 0, 0)
        
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })

        // Simulate availability (in real app, this would come from API)
        const isAvailable = Math.random() > 0.3 // 70% chance of being available
        const isBooked = Math.random() > 0.8 // 20% chance of being booked
        
        slots.push({
          id: `${hour}-${minutes}`,
          time: timeString,
          value: time,
          isAvailable: isAvailable && !isBooked,
          isBooked: isBooked,
          isPast: selectedDate ? isTimeInPast(selectedDate, time) : false
        })
      }
    }

    return slots
  }

  const isTimeInPast = (date, time) => {
    const now = new Date()
    const appointmentDateTime = new Date(date)
    appointmentDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0)
    return appointmentDateTime < now
  }

  useEffect(() => {
    if (selectedDate) {
      setLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        setTimeSlots(generateTimeSlots())
        setLoading(false)
      }, 500)
    }
  }, [selectedDate, doctorId])

  const handleTimeSlotClick = (slot) => {
    if (slot.isAvailable && !slot.isPast) {
      onTimeSlotSelect(slot)
    }
  }

  const getSlotClassName = (slot) => {
    let className = 'time-slot'
    
    if (slot.isPast) {
      className += ' past'
    } else if (slot.isBooked) {
      className += ' unavailable'
    } else if (slot.isAvailable) {
      className += ' available'
    } else {
      className += ' unavailable'
    }
    
    if (selectedTimeSlot && selectedTimeSlot.id === slot.id) {
      className += ' selected'
    }
    
    return className
  }

  if (!selectedDate) {
    return (
      <div className="time-slot-picker">
        <div className="time-slot-placeholder">
          <p>Please select a date first to view available time slots</p>
        </div>
      </div>
    )
  }

  return (
    <div className="time-slot-picker">
      <div className="time-slot-header">
        <h4>Available Time Slots</h4>
        <p>Select your preferred appointment time</p>
      </div>

      {loading ? (
        <div className="time-slots-loading">
          <div className="loading-spinner"></div>
          <p>Loading available slots...</p>
        </div>
      ) : (
        <div className="time-slots-grid">
          {timeSlots.map(slot => (
            <button
              key={slot.id}
              className={getSlotClassName(slot)}
              onClick={() => handleTimeSlotClick(slot)}
              disabled={slot.isPast || slot.isBooked || !slot.isAvailable}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}

      <div className="time-slot-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unavailable"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}

export default TimeSlotPicker
