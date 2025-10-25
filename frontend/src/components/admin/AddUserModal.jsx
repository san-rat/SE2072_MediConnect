import { useState } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    // Patient-specific fields
    dateOfBirth: '',
    emergencyContact: '',
    bloodGroup: '',
    medicalHistory: '',
    // Doctor-specific fields
    specialization: 'General Medicine',
    licenseNumber: '',
    yearsExperience: 1,
    consultationFee: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Role-specific validation
    if (formData.role === 'patient') {
      if (!formData.dateOfBirth) {
        setError('Date of birth is required for patients');
        return;
      }
      if (!formData.emergencyContact) {
        setError('Emergency contact is required for patients');
        return;
      }
    } else if (formData.role === 'doctor') {
      if (!formData.specialization) {
        setError('Specialization is required for doctors');
        return;
      }
      if (!formData.licenseNumber) {
        setError('License number is required for doctors');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Create user based on role
      if (formData.role === 'patient') {
        await adminService.createPatient({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          emergencyContact: formData.emergencyContact,
          bloodGroup: formData.bloodGroup || null,
          medicalHistory: formData.medicalHistory || null
        });
      } else if (formData.role === 'doctor') {
        await adminService.createDoctor({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
          yearsExperience: formData.yearsExperience,
          consultationFee: formData.consultationFee
        });
      }

      setSuccess(`${formData.role === 'patient' ? 'Patient' : 'Doctor'} created successfully!`);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        dateOfBirth: '',
        emergencyContact: '',
        bloodGroup: '',
        medicalHistory: '',
        specialization: 'General Medicine',
        licenseNumber: '',
        yearsExperience: 1,
        consultationFee: 100
      });

      // Notify parent component
      if (onUserAdded) {
        onUserAdded();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">User Type *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Patient-specific fields */}
          {formData.role === 'patient' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyContact">Emergency Contact *</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    required
                    placeholder="Name and phone number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
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
                </div>

                <div className="form-group">
                  <label htmlFor="medicalHistory">Medical History</label>
                  <input
                    type="text"
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Any existing conditions"
                  />
                </div>
              </div>
            </>
          )}

          {/* Doctor-specific fields */}
          {formData.role === 'doctor' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specialization">Specialization *</label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="licenseNumber">License Number *</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Medical license number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="yearsExperience">Years of Experience *</label>
                  <input
                    type="number"
                    id="yearsExperience"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="50"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="consultationFee">Consultation Fee (LKR) *</label>
                  <input
                    type="number"
                    id="consultationFee"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm password"
                minLength="6"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
