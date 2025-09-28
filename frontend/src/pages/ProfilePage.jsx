import React, { useState, useEffect } from 'react';
import { getPatientProfile, updatePatientProfile } from '../services/patient';
import './ProfilePage.css';

function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    bloodGroup: '',
    medicalHistory: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getPatientProfile();
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        dateOfBirth: profileData.dateOfBirth || '',
        emergencyContact: profileData.emergencyContact || '',
        bloodGroup: profileData.bloodGroup || '',
        medicalHistory: profileData.medicalHistory || ''
      });
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const updatedProfile = await updatePatientProfile(formData);
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth || '',
      emergencyContact: profile.emergencyContact || '',
      bloodGroup: profile.bloodGroup || '',
      medicalHistory: profile.medicalHistory || ''
    });
    setEditing(false);
    setError(null);
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="profile-wrap">
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-wrap">
        <div className="profile-card empty">
          <h2>Profile Not Found</h2>
          <p>We couldn't find your patient profile. Please contact support.</p>
          <button className="btn btn-primary" onClick={loadProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            <img 
              src={user?.avatar || '/user-avatar-svgrepo-com.svg'} 
              alt="Profile" 
            />
          </div>
          <div className="identity">
            <h1 className="name">
              {editing ? (
                <div className="name-inputs">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                `${profile.firstName} ${profile.lastName}`
              )}
            </h1>
            <span className="role-badge" data-role="patient">
              Patient
            </span>
          </div>
          <div className="header-actions">
            {editing ? (
              <>
                <button 
                  className="btn btn-outline" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" onClick={() => setSuccess(false)}>
            <span className="success-icon">✓</span>
            Profile updated successfully!
            <span className="dismiss-icon">×</span>
          </div>
        )}

        <div className="profile-grid">
          <div className="field">
            <span className="label">Email</span>
            <span className="value">
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                profile.email
              )}
            </span>
          </div>

          <div className="field">
            <span className="label">Phone</span>
            <span className="value">
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                profile.phone
              )}
            </span>
          </div>

          <div className="field">
            <span className="label">Date of Birth</span>
            <span className="value">
              {editing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'
              )}
            </span>
          </div>

          <div className="field">
            <span className="label">Blood Group</span>
            <span className="value">
              {editing ? (
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                profile.bloodGroup || 'Not provided'
              )}
            </span>
          </div>

          <div className="field">
            <span className="label">Emergency Contact</span>
            <span className="value">
              {editing ? (
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Emergency contact number"
                />
              ) : (
                profile.emergencyContact
              )}
            </span>
          </div>

          <div className="field">
            <span className="label">Member Since</span>
            <span className="value">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>

        <div className="about">
          <h3>Medical History</h3>
          {editing ? (
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter your medical history, allergies, medications, etc."
              rows="4"
            />
          ) : (
            <p>
              {profile.medicalHistory || 'No medical history recorded.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;