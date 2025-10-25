import api from "../lib/api";

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [users, doctors, patients, appointments] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/doctors"),
        api.get("/api/patients"),
        api.get("/api/appointments")
      ]);
      
      return {
        totalUsers: users.data.length,
        totalDoctors: doctors.data.length,
        totalPatients: patients.data.length,
        totalAppointments: appointments.data.length
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0
      };
    }
  },

  // User management
  async getAllUsers() {
    const { data } = await api.get("/api/users");
    return data;
  },

  async deleteUser(userId) {
    await api.delete(`/api/users/${userId}`);
  },

  // Doctor management
  async getAllDoctors() {
    const { data } = await api.get("/api/doctors");
    return data;
  },

  async deleteDoctor(doctorId) {
    await api.delete(`/api/doctors/${doctorId}`);
  },

  // Patient management
  async getAllPatients() {
    const { data } = await api.get("/api/patients");
    return data;
  },

  async deletePatient(patientId) {
    await api.delete(`/api/patients/${patientId}`);
  },

  // Appointment management
  async getAllAppointments() {
    const { data } = await api.get("/api/appointments");
    return data;
  },

  async deleteAppointment(appointmentId) {
    await api.delete(`/api/appointments/${appointmentId}`);
  },

  // Admin management
  async getAllAdmins() {
    const { data } = await api.get("/api/admins");
    return data;
  },

  async createAdmin(adminData) {
    const { data } = await api.post("/api/admins/create", adminData);
    return data;
  },

  async deleteAdmin(adminId) {
    await api.delete(`/api/admins/${adminId}`);
  },

  // Recent activity data
  async getRecentActivity() {
    try {
      const [recentUsers, recentDoctors, recentAppointments] = await Promise.all([
        api.get("/api/users").catch(() => ({ data: [] })),
        api.get("/api/doctors").catch(() => ({ data: [] })),
        api.get("/api/appointments").catch(() => ({ data: [] }))
      ]);

      const activities = [];

      // Add recent users (last 3)
      recentUsers.data.slice(0, 3).forEach(user => {
        activities.push({
          type: 'user',
          icon: '👤',
          message: `New user registered: ${user.firstName} ${user.lastName}`,
          time: new Date(user.createdAt),
          id: user.id
        });
      });

      // Add recent doctors (last 3)
      recentDoctors.data.slice(0, 3).forEach(doctor => {
        activities.push({
          type: 'doctor',
          icon: '👨‍⚕️',
          message: `New doctor registered: Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialization})`,
          time: new Date(doctor.createdAt),
          id: doctor.id
        });
      });

      // Add recent appointments (last 3)
      recentAppointments.data.slice(0, 3).forEach(appointment => {
        activities.push({
          type: 'appointment',
          icon: '📅',
          message: `New appointment scheduled: ${appointment.patientName || 'Patient'} with ${appointment.doctorName || 'Doctor'}`,
          time: new Date(appointment.createdAt || appointment.appointmentDate),
          id: appointment.id
        });
      });

      // Sort by time (most recent first) and take top 5
      return activities
        .sort((a, b) => b.time - a.time)
        .slice(0, 5)
        .map(activity => ({
          ...activity,
          timeAgo: getTimeAgo(activity.time)
        }));

    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
