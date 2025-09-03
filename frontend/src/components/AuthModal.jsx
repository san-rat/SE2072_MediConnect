import { useState, useEffect } from 'react'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [userType, setUserType] = useState('patient')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    dateOfBirth: '',
    emergencyContact: ''
  })

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login')
      setErrors({})
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        dateOfBirth: '',
        emergencyContact: ''
      })
    }
  }, [isOpen, initialMode])

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      // Doctor-specific validations
      if (userType === 'doctor') {
        if (!formData.specialization) {
          newErrors.specialization = 'Specialization is required'
        }
        if (!formData.licenseNumber.trim()) {
          newErrors.licenseNumber = 'Medical license number is required'
        }
      }

      // Patient-specific validations
      if (userType === 'patient') {
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required'
        } else {
          const birthDate = new Date(formData.dateOfBirth)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          if (age < 0 || age > 150) {
            newErrors.dateOfBirth = 'Please enter a valid date of birth'
          }
        }
        if (!formData.emergencyContact.trim()) {
          newErrors.emergencyContact = 'Emergency contact is required'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Form submitted:', { userType, isLogin, formData })
      
      alert(`${isLogin ? 'Login' : 'Registration'} successful!`)
      onClose()
      
    } catch (error) {
      console.error('Submission error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setUserType('patient')
    setErrors({})
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
      dateOfBirth: '',
      emergencyContact: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>MediConnect</h2>
          <p>Smart Appointments. Better Care</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {!isLogin && (
          <div className="user-type-selector">
            <label className="radio-group">
              <input
                type="radio"
                name="userType"
                value="patient"
                checked={userType === 'patient'}
                onChange={(e) => setUserType(e.target.value)}
              />
              <span className="radio-label">Patient</span>
            </label>
            <label className="radio-group">
              <input
                type="radio"
                name="userType"
                value="doctor"
                checked={userType === 'doctor'}
                onChange={(e) => setUserType(e.target.value)}
              />
              <span className="radio-label">Doctor</span>
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-row">
              <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
          )}

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {!isLogin && (
            <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
          )}

          {!isLogin && (
            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          )}

          {!isLogin && userType === 'doctor' && (
            <>
              <div className={`form-group ${errors.specialization ? 'error' : ''}`}>
                <label>Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="endocrinology">Endocrinology</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="neurology">Neurology</option>
                  <option value="oncology">Oncology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="general">General Practice</option>
                </select>
                {errors.specialization && <div className="error-message">{errors.specialization}</div>}
              </div>
              <div className={`form-group ${errors.licenseNumber ? 'error' : ''}`}>
                <label>Medical License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your license number"
                />
                {errors.licenseNumber && <div className="error-message">{errors.licenseNumber}</div>}
              </div>
            </>
          )}

          {!isLogin && userType === 'patient' && (
            <>
              <div className={`form-group ${errors.dateOfBirth ? 'error' : ''}`}>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
                {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
              </div>
              <div className={`form-group ${errors.emergencyContact ? 'error' : ''}`}>
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  required
                  placeholder="Emergency contact phone number"
                />
                {errors.emergencyContact && <div className="error-message">{errors.emergencyContact}</div>}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting && <div className="loading-spinner"></div>}
            {isSubmitting 
              ? 'Processing...' 
              : isLogin 
                ? 'Sign In' 
                : `Sign Up as ${userType === 'doctor' ? 'Doctor' : 'Patient'}`
            }
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account? "}
            <button className="link-btn" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
