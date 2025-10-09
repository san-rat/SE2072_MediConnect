import { useState, useEffect } from 'react'
import { login } from "../services/auth"
import './AdminLoginModal.css'

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setFormData({ email: '', password: '' })
    setErrors({})
  }, [isOpen])

  const validateForm = () => {
    const e = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.email) e.email = 'Email is required'
    else if (!emailRe.test(formData.email)) e.email = 'Enter a valid email'

    if (!formData.password) e.password = 'Password is required'
    else if (formData.password.length < 6) e.password = 'Min 6 characters'

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
      const loginData = await login(formData.email, formData.password)
      
      // Check if user is admin
      if (loginData.role === 'ADMIN') {
        alert('Admin login successful!')
        onLoginSuccess?.(loginData)
        onClose?.()
      } else {
        alert('Access denied. Admin privileges required.')
      }
    } catch (err) {
      console.error(err)
      
      let errorMessage = 'Login failed. Please check your credentials.'
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="admin-login-content">
          <div className="admin-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM12 13.5C9.5 13.5 7.5 15.5 7.5 18V20H16.5V18C16.5 15.5 14.5 13.5 12 13.5Z" fill="#4F46E5"/>
            </svg>
          </div>
          
          <p className="admin-login-description">
            Enter your admin credentials to access the management panel
          </p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="admin@mediconnect.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="admin-login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p className="security-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#10B981"/>
              </svg>
              Secure admin access only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginModal
