import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardSidebar from './DoctorDashboardSidebar';
import doctorAPI from '../services/doctor';
import './DoctorProfilePage.css';

const DoctorProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    yearsExperience: 0,
    consultationFee: 0,
    bio: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    education: '',
    certifications: []
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const profileData = await doctorAPI.getMyProfile();
        setProfileData({
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john.doe@hospital.com',
          phone: '+1234567890',
          specialization: 'Cardiology',
          yearsExperience: 15,
          consultationFee: 150,
          bio: 'Experienced cardiologist with over 15 years of practice. Specializing in interventional cardiology and preventive care.',
          address: '123 Medical Center Dr',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          licenseNumber: 'MD123456789',
          hospitalAffiliation: 'New York Medical Center',
          education: 'MD, Harvard Medical School (2008)',
          certifications: ['Board Certified in Internal Medicine', 'Fellow of the American College of Cardiology']
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_token_type');
    localStorage.removeItem('mc_role');
    navigate('/');
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await doctorAPI.updateProfile(profileData);
      setIsEditing(false);
      // You could show a success message here
    } catch (error) {
      console.error('Error saving profile:', error);
      // You could show an error message here
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  if (isLoading) {
    return (
      <div className="doctor-dashboard-layout">
        <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-layout">
      <DoctorDashboardSidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="doctor-profile-page">
          <div className="page-header">
            <h1>My Profile</h1>
            <p>Manage your professional information and settings</p>
            <div className="header-actions">
              {!isEditing ? (
                <button 
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-content">
            {/* Personal Information */}
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="profile-section">
              <h2>Professional Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={profileData.specialization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={profileData.yearsExperience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={profileData.consultationFee}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profileData.licenseNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="profile-section">
              <h2>Bio</h2>
              <div className="form-group">
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="profile-section">
              <h2>Address Information</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editable' : ''}
                  />
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="profile-section">
              <h2>Education & Certifications</h2>
              <div className="form-group">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              <div className="form-group">
                <label>Hospital Affiliation</label>
                <input
                  type="text"
                  name="hospitalAffiliation"
                  value={profileData.hospitalAffiliation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
              <div className="form-group">
                <label>Certifications</label>
                <div className="certifications-list">
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <span>{cert}</span>
                      {isEditing && (
                        <button 
                          className="remove-cert"
                          onClick={() => {
                            const newCerts = profileData.certifications.filter((_, i) => i !== index);
                            setProfileData(prev => ({ ...prev, certifications: newCerts }));
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button 
                      className="add-cert"
                      onClick={() => {
                        const newCert = prompt('Enter certification:');
                        if (newCert) {
                          setProfileData(prev => ({
                            ...prev,
                            certifications: [...prev.certifications, newCert]
                          }));
                        }
                      }}
                    >
                      + Add Certification
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
