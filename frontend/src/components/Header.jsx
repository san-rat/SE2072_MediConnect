import { useState, useEffect } from 'react'
import './Header.css'

const Header = ({ onLoginClick, onRegisterClick, isModalOpen, currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Auto-close menu when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setIsMenuOpen(false)
    }
  }, [isModalOpen])

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-mark" aria-label="Hospital" role="img"></span>
          <h1>MediConnect</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => { onPageChange('home'); closeMenu(); }}
              >
                HOME
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'prescriptions' ? 'active' : ''}`}
                onClick={() => { onPageChange('prescriptions'); closeMenu(); }}
              >
                PRESCRIPTIONS
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'appointments' ? 'active' : ''}`}
                onClick={() => { onPageChange('appointments'); closeMenu(); }}
              >
                APPOINTMENTS
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
                onClick={() => { onPageChange('notifications'); closeMenu(); }}
              >
                NOTIFICATIONS
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => { onPageChange('contact'); closeMenu(); }}
              >
                CONTACT
              </button>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button
            className="btn btn-outline"
            onClick={() => { closeMenu(); onLoginClick(); }}
          >
            Login
          </button>
          <button
            className="btn btn-primary"
            onClick={() => { closeMenu(); onRegisterClick(); }}
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links-mobile">
          <li>
            <button 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => { onPageChange('home'); closeMenu(); }}
            >
              HOME
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'prescriptions' ? 'active' : ''}`}
              onClick={() => { onPageChange('prescriptions'); closeMenu(); }}
            >
              PRESCRIPTIONS
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'appointments' ? 'active' : ''}`}
              onClick={() => { onPageChange('appointments'); closeMenu(); }}
            >
              APPOINTMENTS
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
              onClick={() => { onPageChange('notifications'); closeMenu(); }}
            >
              NOTIFICATIONS
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => { onPageChange('contact'); closeMenu(); }}
            >
              CONTACT
            </button>
          </li>
          <li className="mobile-auth-buttons">
            <button className="btn btn-outline" onClick={() => { onLoginClick(); closeMenu(); }}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => { onRegisterClick(); closeMenu(); }}>
              Register
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header