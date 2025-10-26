import { api } from '../lib/api';

export const feedbackService = {
  // Create new feedback
  async createFeedback(feedbackData) {
    try {
      const response = await api.post('/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },

  // Get all feedback (admin only)
  async getAllFeedback() {
    try {
      const response = await api.get('/api/feedback');
      return response.data;
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  },

  // Get feedback by patient ID
  async getFeedbackByPatientId(patientId) {
    try {
      const response = await api.get(`/api/feedback/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient feedback:', error);
      throw error;
    }
  },

  // Get feedback by doctor ID
  async getFeedbackByDoctorId(doctorId) {
    try {
      const response = await api.get(`/api/feedback/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor feedback:', error);
      throw error;
    }
  },

  // Get feedback by ID
  async getFeedbackById(id) {
    try {
      const response = await api.get(`/api/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  // Delete feedback (admin only)
  async deleteFeedback(id) {
    try {
      await api.delete(`/api/feedback/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  },

  // Get average rating
  getAverageRating(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + (feedback.rating || 0), 0);
    return (sum / feedbacks.length).toFixed(1);
  }
};

