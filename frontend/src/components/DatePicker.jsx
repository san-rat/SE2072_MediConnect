import React, { useState } from 'react'

const DatePicker = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)

  const today = new Date()
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day)
      const isPast = date < today
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      
      days.push({
        day,
        date,
        isPast,
        isToday,
        isSelected
      })
    }
    
    return days
  }

  const handleDateClick = (dayData) => {
    if (dayData && !dayData.isPast) {
      onDateSelect(dayData.date)
      setIsOpen(false)
    }
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="date-picker">
      <div className="date-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="date-display">
          {selectedDate ? (
            <div>
              <span className="date-text">{formatDate(selectedDate)}</span>
              <span className="date-label">Selected Date</span>
            </div>
          ) : (
            <div>
              <span className="date-text">Select a date</span>
              <span className="date-label">Choose your appointment date</span>
            </div>
          )}
        </div>
        <div className="calendar-icon">📅</div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="calendar-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-header">
              <button 
                className="nav-button" 
                onClick={() => navigateMonth(-1)}
                disabled={currentMonthIndex <= today.getMonth() && currentYear <= today.getFullYear()}
              >
                ‹
              </button>
              <h3 className="month-year">
                {monthNames[currentMonthIndex]} {currentYear}
              </h3>
              <button 
                className="nav-button" 
                onClick={() => navigateMonth(1)}
              >
                ›
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekdays">
                {weekDays.map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              
              <div className="days-grid">
                {generateCalendarDays().map((dayData, index) => (
                  <div
                    key={index}
                    className={`day-cell ${dayData ? 'has-day' : 'empty'} ${
                      dayData?.isPast ? 'past' : ''
                    } ${dayData?.isToday ? 'today' : ''} ${
                      dayData?.isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleDateClick(dayData)}
                  >
                    {dayData && <span className="day-number">{dayData.day}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
