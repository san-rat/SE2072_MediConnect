import { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedback';
import useCurrentUser from '../hooks/useCurrentUser';
import api from '../lib/api';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const { user, loadingUser } = useCurrentUser();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    doctorId: '',
    rating: 5,
    comment: ''
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (user && user.role === 'PATIENT') {
      loadPatientId();
      loadDoctors();
    }
  }, [user]);
  
  const loadPatientId = async () => {
    try {
      const response = await api.get('/api/patients/profile');
      setPatientId(response.data.id);
      loadFeedbacks(response.data.id);
    } catch (error) {
      console.error('Error loading patient profile:', error);
      setError('Failed to load patient information. Please try again.');
    }
  };

  const loadFeedbacks = async (patientIdParam) => {
    if (!patientIdParam) return;
    try {
      setLoading(true);
      const data = await feedbackService.getFeedbackByPatientId(patientIdParam);
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setError('Failed to load your feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      // Load doctors from the appointments or a separate endpoint
      const response = await api.get('/api/doctors');
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!patientId) {
      setError('Patient information not loaded. Please refresh the page.');
      return;
    }

    try {
      const feedbackData = {
        patientId: patientId,
        doctorId: formData.doctorId || null,
        rating: formData.rating,
        comment: formData.comment
      };

      await feedbackService.createFeedback(feedbackData);
      setSuccess('Thank you for your feedback!');
      setFormData({
        doctorId: '',
        rating: 5,
        comment: ''
      });
      setShowForm(false);
      loadFeedbacks(patientId); // Reload feedbacks
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again.';
      setError(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loadingUser) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user || user.role !== 'PATIENT') {
    return <div className="feedback-page">Only patients can access this page.</div>;
  }

  return (
    <main className="feedback-page">
      <div className="page-container">
        <div className="page-header">
          <h1>My Feedback</h1>
          <p>Share your experience with our services</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="feedback-actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Feedback'}
          </button>
        </div>

        {showForm && (
          <div className="feedback-form-container">
            <form className="feedback-form" onSubmit={handleSubmit}>
              <h2>Submit Feedback</h2>
              
              <div className="form-group">
                <label htmlFor="doctorId">Doctor (Optional)</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                >
                  <option value="">General Feedback</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.specialization} - {doctor.user.firstName} {doctor.user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= formData.rating ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="rating-text">{formData.rating} / 5</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Share your feedback..."
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Feedback
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-container">Loading your feedbacks...</div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any feedback yet.</p>
            <p>Help us improve by sharing your experience!</p>
          </div>
        ) : (
          <div className="feedbacks-list">
            {feedbacks.map(feedback => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-header">
                  <div className="feedback-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < feedback.rating ? 'star-filled' : 'star-empty'}>
                        ⭐
                      </span>
                    ))}
                    <span className="rating-number">{feedback.rating}/5</span>
                  </div>
                  <div className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {feedback.doctorName && (
                  <div className="feedback-doctor">
                    Dr. {feedback.doctorName} - {feedback.specialization}
                  </div>
                )}
                
                {feedback.comment && (
                  <div className="feedback-comment">{feedback.comment}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default FeedbackPage;

