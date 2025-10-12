import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorAppointmentsPage.css';

const DoctorAppointmentsPage = ({ user }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showAvailabilityView, setShowAvailabilityView] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState(null);
  const [availability, setAvailability] = useState({
    selectedDate: '',
    startTime: '',
    endTime: '',
    slotDuration: 30,
    isRecurring: false,
    recurringDays: []
  });

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const appointmentsData = await doctorAPI.getMyAppointments();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Load appointments based on filter
  useEffect(() => {
    const loadFilteredAppointments = async () => {
      if (filter === 'all') return; // Already loaded in initial useEffect
      
      setIsLoading(true);
      try {
        let appointmentsData = [];
        switch (filter) {
          case 'today':
            appointmentsData = await doctorAPI.getTodayAppointments();
            break;
          case 'tomorrow':
            appointmentsData = await doctorAPI.getTomorrowAppointments();
            break;
          case 'upcoming':
            appointmentsData = await doctorAPI.getUpcomingAppointments();
            break;
          case 'past':
            appointmentsData = await doctorAPI.getPastAppointments();
            break;
          default:
            appointmentsData = await doctorAPI.getMyAppointments();
        }
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading filtered appointments:', error);
        // Keep existing appointments on error
      } finally {
        setIsLoading(false);
      }
    };

    loadFilteredAppointments();
  }, [filter]);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    switch (filter) {
      case 'today':
        return appointments.filter(apt => apt.date === today);
      case 'tomorrow':
        return appointments.filter(apt => apt.date === tomorrow);
      case 'upcoming':
        return appointments.filter(apt => apt.date > today);
      case 'past':
        return appointments.filter(apt => apt.date < today);
      case 'all':
        return appointments;
      default:
        return appointments;
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      // You could show a toast notification here
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (availability.isRecurring) {
        // Convert day names to DayOfWeek enum values
        const dayMapping = {
          'Monday': 'MONDAY',
          'Tuesday': 'TUESDAY', 
          'Wednesday': 'WEDNESDAY',
          'Thursday': 'THURSDAY',
          'Friday': 'FRIDAY',
          'Saturday': 'SATURDAY',
          'Sunday': 'SUNDAY'
        };
        
        const days = availability.recurringDays.map(day => dayMapping[day]);
        
        await doctorAPI.setRecurringAvailability(
          days,
          availability.startTime,
          availability.endTime,
          availability.slotDuration
        );
      } else {
        await doctorAPI.setAvailability(
          availability.selectedDate,
          availability.startTime,
          availability.endTime,
          availability.slotDuration
        );
      }
      
      alert('Availability settings saved successfully!');
      setShowAvailability(false);
      
      // Reset form
      setAvailability({
        selectedDate: '',
        startTime: '',
        endTime: '',
        slotDuration: 30,
        isRecurring: false,
        recurringDays: []
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Error saving availability settings');
    }
  };


  const handleRecurringDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  // Load current availability
  const loadCurrentAvailability = async () => {
    try {
      const availabilityData = await doctorAPI.getMyAvailability();
      setCurrentAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading current availability:', error);
    }
  };

  // Show current availability
  const handleShowAvailability = () => {
    setShowAvailabilityView(true);
    loadCurrentAvailability();
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-appointments-page">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Manage your patient appointments and schedule</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today ({appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'tomorrow' ? 'active' : ''}`}
              onClick={() => setFilter('tomorrow')}
            >
              Tomorrow ({appointments.filter(apt => apt.date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({appointments.filter(apt => apt.date > new Date().toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past ({appointments.filter(apt => apt.date < new Date().toISOString().split('T')[0]).length})
            </button>
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Appointments ({appointments.length})
            </button>
          </div>

          {/* Appointments List */}
          <div className="appointments-container">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-time">
                      <span className="time">{appointment.time}</span>
                      <span className="date">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="appointment-status">
                      <select 
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`status-select ${appointment.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="appointment-content">
                    <div className="patient-info">
                      <h3>{appointment.patientName}</h3>
                      <p className="patient-contact">{appointment.patientEmail}</p>
                      <p className="patient-contact">{appointment.patientPhone}</p>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">{appointment.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Reason:</span>
                        <span className="value">{appointment.reason}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Notes:</span>
                        <span className="value">{appointment.notes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="appointment-actions">
                    <button className="btn-primary">View Details</button>
                    <button className="btn-secondary">Start Consultation</button>
                    <button className="btn-outline">Reschedule</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No appointments found</h3>
                <p>No appointments match your current filter criteria.</p>
              </div>
            )}
          </div>

          {/* Availability Management Section */}
          <div className="availability-section">
            <div className="availability-header">
              <div className="availability-title">
                <h2>📅 Manage Availability</h2>
                <p>Set your working schedule and available time slots</p>
              </div>
            <div className="availability-actions">
              <button 
                className="view-availability-btn"
                onClick={handleShowAvailability}
              >
                👁️ View Current
              </button>
              <button 
                className={`availability-toggle ${showAvailability ? 'active' : ''}`}
                onClick={() => setShowAvailability(!showAvailability)}
              >
                {showAvailability ? '✕ Hide' : '⚙️ Manage'}
              </button>
            </div>
            </div>

            {showAvailability && (
              <div className="availability-content">
                <div className="availability-tabs">
                  <button 
                    className={`tab-button ${!availability.isRecurring ? 'active' : ''}`}
                    onClick={() => setAvailability(prev => ({ ...prev, isRecurring: false }))}
                  >
                    📅 Single Date
                  </button>
                  <button 
                    className={`tab-button ${availability.isRecurring ? 'active' : ''}`}
                    onClick={() => setAvailability(prev => ({ ...prev, isRecurring: true }))}
                  >
                    🔄 Recurring Schedule
                  </button>
                </div>

                <form onSubmit={handleAvailabilitySubmit} className="availability-form">
                  {!availability.isRecurring ? (
                    <div className="single-date-form">
                      <div className="form-card">
                        <div className="form-card-header">
                          <h3>📅 Set Availability for Specific Date</h3>
                        </div>
                        <div className="form-fields">
                          <div className="field-group">
                            <label htmlFor="selectedDate">Select Date</label>
                            <div className="input-wrapper">
                              <input
                                type="date"
                                id="selectedDate"
                                value={availability.selectedDate}
                                onChange={(e) => setAvailability(prev => ({ ...prev, selectedDate: e.target.value }))}
                                min={new Date().getFullYear() + '-' + 
                                  String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(new Date().getDate()).padStart(2, '0')}
                                required
                              />
                            </div>
                          </div>
                          <div className="time-range-horizontal">
                            <div className="time-field">
                              <label htmlFor="startTime">Start Time</label>
                              <input
                                type="time"
                                id="startTime"
                                value={availability.startTime}
                                onChange={(e) => setAvailability(prev => ({ ...prev, startTime: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="time-divider">to</div>
                            <div className="time-field">
                              <label htmlFor="endTime">End Time</label>
                              <input
                                type="time"
                                id="endTime"
                                value={availability.endTime}
                                onChange={(e) => setAvailability(prev => ({ ...prev, endTime: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <label htmlFor="slotDuration">Appointment Duration</label>
                            <div className="input-wrapper">
                              <select
                                id="slotDuration"
                                value={availability.slotDuration}
                                onChange={(e) => setAvailability(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
                              >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="recurring-form">
                      <div className="form-card">
                        <div className="form-card-header">
                          <h3>🔄 Set Recurring Weekly Schedule</h3>
                        </div>
                        <div className="form-fields">
                          <div className="time-range-horizontal">
                            <div className="time-field">
                              <label htmlFor="recurringStartTime">Start Time</label>
                              <input
                                type="time"
                                id="recurringStartTime"
                                value={availability.startTime}
                                onChange={(e) => setAvailability(prev => ({ ...prev, startTime: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="time-divider">to</div>
                            <div className="time-field">
                              <label htmlFor="recurringEndTime">End Time</label>
                              <input
                                type="time"
                                id="recurringEndTime"
                                value={availability.endTime}
                                onChange={(e) => setAvailability(prev => ({ ...prev, endTime: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <label htmlFor="recurringSlotDuration">Appointment Duration</label>
                            <div className="input-wrapper">
                              <select
                                id="recurringSlotDuration"
                                value={availability.slotDuration}
                                onChange={(e) => setAvailability(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
                              >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                              </select>
                            </div>
                          </div>
                          <div className="field-group">
                            <label>Select Working Days</label>
                            <div className="days-grid">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <label key={day} className={`day-option ${availability.recurringDays.includes(day) ? 'selected' : ''}`}>
                                  <input
                                    type="checkbox"
                                    checked={availability.recurringDays.includes(day)}
                                    onChange={() => handleRecurringDayToggle(day)}
                                  />
                                  <span className="day-name">{day.substring(0, 3)}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowAvailability(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-save">
                      💾 Save Availability
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Current Availability View Modal */}
        {showAvailabilityView && (
          <div className="availability-modal-overlay">
            <div className="availability-modal">
              <div className="availability-modal-header">
                <h2>📅 Current Availability</h2>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowAvailabilityView(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="availability-modal-content">
                {currentAvailability ? (
                  <div className="availability-details">
                    <div className="doctor-info">
                      <h3>Dr. {currentAvailability.doctorName}</h3>
                    </div>
                    
                    <div className="schedules-section">
                      <h4>📋 Weekly Schedule</h4>
                      <div className="schedules-grid">
                        {currentAvailability.schedules.map(schedule => (
                          <div key={schedule.dayOfWeek} className="schedule-card">
                            <div className="day-name">{schedule.dayOfWeek}</div>
                            <div className="time-range">
                              {schedule.isAvailable ? (
                                <>
                                  <span className="time">{schedule.startTime}</span>
                                  <span className="separator">to</span>
                                  <span className="time">{schedule.endTime}</span>
                                  <span className="duration">({schedule.slotDurationMinutes} min slots)</span>
                                </>
                              ) : (
                                <span className="unavailable">Not Available</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="time-slots-section">
                      <h4>🕐 Available Time Slots (Next 7 Days)</h4>
                      <div className="time-slots-grid">
                        {currentAvailability.timeSlots.map(slot => (
                          <div key={slot.id} className="time-slot-card">
                            <div className="slot-date">{new Date(slot.slotDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</div>
                            <div className="slot-time">{slot.startTime}</div>
                            <div className="slot-status">{slot.isBooked ? 'Booked' : 'Available'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="loading-state">
                    <p>Loading availability...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
