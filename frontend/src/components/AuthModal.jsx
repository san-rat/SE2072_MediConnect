import { useState, useEffect } from 'react'
import { login, registerPatient, registerDoctor } from "../services/auth"
import './AuthModal.css'

const FIELD_DEFAULTS = {
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
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [userType, setUserType] = useState('patient') // 'patient' | 'doctor'
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ ...FIELD_DEFAULTS })

  const isLogin = mode === 'login'

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    setMode(initialMode)
    setUserType('patient')
    setErrors({})
    setFormData({ ...FIELD_DEFAULTS })
  }, [isOpen, initialMode])

  const validateForm = () => {
    const e = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.email) e.email = 'Email is required'
    else if (!emailRe.test(formData.email)) e.email = 'Enter a valid email'

    if (!formData.password) e.password = 'Password is required'
    else if (formData.password.length < 6) e.password = 'Min 6 characters'

    if (!isLogin) {
      if (!formData.firstName.trim()) e.firstName = 'First name is required'
      if (!formData.lastName.trim()) e.lastName = 'Last name is required'
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'

      if (!formData.phone.trim()) e.phone = 'Phone is required'
      else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s-()]/g, ''))) e.phone = 'Enter a valid phone'

      if (userType === 'doctor') {
        if (!formData.specialization) e.specialization = 'Specialization is required'
        if (!formData.licenseNumber.trim()) e.licenseNumber = 'License number is required'
      } else {
        if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
        else {
          const dob = new Date(formData.dateOfBirth)
          const age = new Date().getFullYear() - dob.getFullYear()
          if (isNaN(dob.getTime()) || age < 0 || age > 150) e.dateOfBirth = 'Enter a valid date of birth'
        }
        if (!formData.emergencyContact.trim()) e.emergencyContact = 'Emergency contact is required'
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        alert('Login successful!')
        onClose?.()
        window.location.reload()
      } else {
        if (userType === 'patient') {
          await registerPatient({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            emergencyContact: formData.emergencyContact,
          })
        } else {
          await registerDoctor({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber,
            yearsExperience: 0,
            consultationFee: 0
          })
        }
        alert('Registration successful! Please sign in.')
        setMode('login')
      }
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {!isLogin && (
          <div className="user-type-selector">
            <button 
              className={`user-type-btn ${userType === 'patient' ? 'active' : ''}`}
              onClick={() => setUserType('patient')}
            >
              Patient
            </button>
            <button 
              className={`user-type-btn ${userType === 'doctor' ? 'active' : ''}`}
              onClick={() => setUserType('doctor')}
            >
              Doctor
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+94 7X XXX XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {userType === 'doctor' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="specialization">Specialization</label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={errors.specialization ? 'error' : ''}
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                    </select>
                    {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={errors.licenseNumber ? 'error' : ''}
                    />
                    {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                  </div>
                </div>
              )}

              {userType === 'patient' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={errors.dateOfBirth ? 'error' : ''}
                    />
                    {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContact">Emergency Contact</label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      placeholder="Name / Phone"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={errors.emergencyContact ? 'error' : ''}
                    />
                    {errors.emergencyContact && <span className="error-text">{errors.emergencyContact}</span>}
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div className="auth-switch">
            {isLogin ? (
              <p>New here? <button type="button" className="switch-btn" onClick={() => setMode('register')}>Create a patient account</button></p>
            ) : (
              <p>Already have an account? <button type="button" className="switch-btn" onClick={() => setMode('login')}>Sign in</button></p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthModal