import api from '../lib/api';

// Doctor-specific API calls
export const doctorAPI = {
  // Get doctor's appointments
  getMyAppointments: async () => {
    try {
      const response = await api.get('/api/appointments/doctor/my-appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  },

  // Get filtered appointments
  getTodayAppointments: async () => {
    try {
      const response = await api.get('/api/appointments/doctor/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      throw error;
    }
  },

  getTomorrowAppointments: async () => {
    try {
      const response = await api.get('/api/appointments/doctor/tomorrow');
      return response.data;
    } catch (error) {
      console.error('Error fetching tomorrow\'s appointments:', error);
      throw error;
    }
  },

  getUpcomingAppointments: async () => {
    try {
      const response = await api.get('/api/appointments/doctor/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },

  getPastAppointments: async () => {
    try {
      const response = await api.get('/api/appointments/doctor/past');
      return response.data;
    } catch (error) {
      console.error('Error fetching past appointments:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await api.put(`/api/appointments/${appointmentId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Get doctor's profile
  getMyProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  },

  // Update doctor's profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      throw error;
    }
  },

  // Get doctor's patients (this would need to be implemented in backend)
  getMyPatients: async () => {
    try {
      // For now, return mock data until backend endpoint is implemented
      return [
        {
          id: 1,
          name: 'Alice Johnson',
          age: 34,
          gender: 'Female',
          email: 'alice.johnson@email.com',
          phone: '+1234567890',
          bloodGroup: 'O+',
          lastVisit: '2025-09-20',
          nextAppointment: '2025-10-08',
          medicalHistory: 'Diabetes Type 2, Hypertension',
          emergencyContact: 'John Johnson (+1234567891)',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Bob Williams',
          age: 52,
          gender: 'Male',
          email: 'bob.williams@email.com',
          phone: '+1234567892',
          bloodGroup: 'A+',
          lastVisit: '2025-10-01',
          nextAppointment: null,
          medicalHistory: 'High Cholesterol',
          emergencyContact: 'Mary Williams (+1234567893)',
          status: 'Active'
        }
      ];
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      throw error;
    }
  },

  // Get doctor's prescriptions (this would need to be implemented in backend)
  getMyPrescriptions: async () => {
    try {
      // For now, return mock data until backend endpoint is implemented
      return [
        {
          id: 1,
          prescriptionNumber: 'RX001234',
          patientName: 'Alice Johnson',
          patientEmail: 'alice.johnson@email.com',
          date: '2025-10-01',
          validUntil: '2025-11-01',
          status: 'Active',
          medications: [
            { name: 'Metformin', dosage: '500mg', duration: '30 days' },
            { name: 'Lisinopril', dosage: '10mg', duration: '30 days' }
          ],
          instructions: 'Take with food, once daily',
          notes: 'Monitor blood sugar levels'
        },
        {
          id: 2,
          prescriptionNumber: 'RX001235',
          patientName: 'Bob Williams',
          patientEmail: 'bob.williams@email.com',
          date: '2025-10-02',
          validUntil: '2025-11-02',
          status: 'Pending',
          medications: [
            { name: 'Atorvastatin', dosage: '20mg', duration: '30 days' }
          ],
          instructions: 'Take at bedtime',
          notes: 'Follow up in 4 weeks'
        }
      ];
    } catch (error) {
      console.error('Error fetching doctor prescriptions:', error);
      throw error;
    }
  },

  // Get doctor's notifications (this would need to be implemented in backend)
  getMyNotifications: async () => {
    try {
      // For now, return mock data until backend endpoint is implemented
      return [
        {
          id: 1,
          type: 'appointment',
          title: 'New Appointment Request',
          message: 'John Smith has requested an appointment for tomorrow at 2:00 PM',
          timestamp: '2025-10-04T10:30:00Z',
          isRead: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'prescription',
          title: 'Prescription Refill Request',
          message: 'Alice Johnson needs a refill for her blood pressure medication',
          timestamp: '2025-10-04T09:15:00Z',
          isRead: false,
          priority: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error fetching doctor notifications:', error);
      throw error;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/doctors/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Schedule management
  getMySchedule: async () => {
    try {
      const response = await api.get('/api/doctor-schedule/my-schedule');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      throw error;
    }
  },

  updateSchedule: async (dayOfWeek, startTime, endTime, slotDurationMinutes = 30, isAvailable = true) => {
    try {
      const response = await api.post('/api/doctor-schedule/update-schedule', null, {
        params: {
          dayOfWeek,
          startTime,
          endTime,
          slotDurationMinutes,
          isAvailable
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  setAvailability: async (date, startTime, endTime, slotDurationMinutes = 30) => {
    try {
      const response = await api.post('/api/doctor-schedule/set-availability', null, {
        params: {
          dateStr: date,
          startTimeStr: startTime,
          endTimeStr: endTime,
          slotDurationMinutes
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error setting availability:', error);
      throw error;
    }
  },

  setRecurringAvailability: async (days, startTime, endTime, slotDurationMinutes = 30) => {
    try {
      const response = await api.post('/api/doctor-schedule/set-recurring-availability', {
        days,
        startTime,
        endTime,
        slotDurationMinutes
      });
      return response.data;
    } catch (error) {
      console.error('Error setting recurring availability:', error);
      throw error;
    }
  },

  // Get doctor's current availability
  getMyAvailability: async () => {
    try {
      const response = await api.get('/api/doctor-schedule/my-availability');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      throw error;
    }
  }
};

export default doctorAPI;
