import { useState, useEffect } from 'react';
import { feedbackService } from '../../services/feedback';
import './FeedbackManagement.css';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all'); // all, recent, positive, negative

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setError('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const getFilteredFeedbacks = () => {
    let filtered = feedbacks;
    
    if (filter === 'positive') {
      filtered = feedbacks.filter(f => f.rating >= 4);
    } else if (filter === 'negative') {
      filtered = feedbacks.filter(f => f.rating <= 2);
    } else if (filter === 'recent') {
      // Show feedbacks from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = feedbacks.filter(f => new Date(f.createdAt) >= sevenDaysAgo);
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(f => {
      distribution[f.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="feedback-management">
      <div className="feedback-header">
        <h2>Feedback Management</h2>
        <p>View and manage all patient feedback</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-container">Loading feedbacks...</div>
      ) : (
        <>
          {/* Statistics */}
          <div className="feedback-stats">
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <h3>{feedbacks.length}</h3>
                <p>Total Feedback</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{getAverageRating()}</h3>
                <p>Average Rating</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">😊</div>
              <div className="stat-info">
                <h3>{feedbacks.filter(f => f.rating >= 4).length}</h3>
                <p>Positive Feedback</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">😕</div>
              <div className="stat-info">
                <h3>{feedbacks.filter(f => f.rating <= 2).length}</h3>
                <p>Negative Feedback</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="rating-distribution">
            <h3>Rating Distribution</h3>
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating];
                const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                return (
                  <div key={rating} className="distribution-item">
                    <div className="distribution-label">
                      <span>{rating}⭐</span>
                      <span>{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Feedback</option>
              <option value="recent">Last 7 Days</option>
              <option value="positive">Positive (4-5 stars)</option>
              <option value="negative">Negative (1-2 stars)</option>
            </select>
          </div>

          {/* Feedback List */}
          <div className="feedback-list">
            {getFilteredFeedbacks().length === 0 ? (
              <div className="empty-state">
                <p>No feedback found matching the selected filter.</p>
              </div>
            ) : (
              getFilteredFeedbacks().map(feedback => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-card-header">
                    <div className="feedback-rating">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < feedback.rating ? 'star-filled' : 'star-empty'}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="rating-number">{feedback.rating}/5</span>
                    </div>
                    <div className="feedback-actions">
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(feedback.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {feedback.doctorName ? (
                    <div className="feedback-doctor">
                      <strong>Doctor:</strong> Dr. {feedback.doctorName} ({feedback.specialization})
                    </div>
                  ) : (
                    <div className="feedback-doctor">
                      <strong>Type:</strong> General Feedback
                    </div>
                  )}

                  <div className="feedback-patient">
                    <strong>Patient:</strong> {feedback.patientName}
                  </div>

                  {feedback.comment && (
                    <div className="feedback-comment">
                      <strong>Comment:</strong> {feedback.comment}
                    </div>
                  )}

                  <div className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Feedback Detail Modal */}
          {selectedFeedback && (
            <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Feedback Details</h3>
                  <button onClick={() => setSelectedFeedback(null)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="detail-item">
                    <strong>Patient:</strong>
                    <p>{selectedFeedback.patientName}</p>
                  </div>
                  {selectedFeedback.doctorName && (
                    <div className="detail-item">
                      <strong>Doctor:</strong>
                      <p>Dr. {selectedFeedback.doctorName} - {selectedFeedback.specialization}</p>
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Rating:</strong>
                    <div className="detail-rating">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < selectedFeedback.rating ? 'star-filled' : 'star-empty'}
                        >
                          ⭐
                        </span>
                      ))}
                      <span>{selectedFeedback.rating}/5</span>
                    </div>
                  </div>
                  {selectedFeedback.comment && (
                    <div className="detail-item">
                      <strong>Comment:</strong>
                      <p>{selectedFeedback.comment}</p>
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Submitted:</strong>
                    <p>{new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      handleDelete(selectedFeedback.id);
                      setSelectedFeedback(null);
                    }}
                  >
                    Delete Feedback
                  </button>
                  <button 
                    className="btn-close"
                    onClick={() => setSelectedFeedback(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackManagement;

