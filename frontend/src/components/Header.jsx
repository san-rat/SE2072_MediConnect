import { useState, useEffect } from 'react'
import './Header.css'

const Header = ({ onLoginClick, onRegisterClick, isModalOpen, currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('mc_token'))

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Auto-close menu when modal opens
  useEffect(() => {
    if (isModalOpen) setIsMenuOpen(false)
  }, [isModalOpen])

  // Listen for auth changes (in case other tabs log in/out)
  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem('mc_token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mc_token')
    localStorage.removeItem('mc_token_type')
    localStorage.removeItem('mc_role')
    setIsAuthed(false)
    window.location.reload()
  }

  return (
    <header className={`header ${isAuthed ? 'authenticated' : 'unauthenticated'}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-mark" aria-label="Hospital" role="img"></span>
          <h1>MediConnect</h1>
          <span className="tagline">Smart Appointments. Better Care.</span>
        </div>

        {/* Desktop Navigation - Only show when authenticated */}
        {isAuthed && (
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
        )}

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthed ? (
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Menu Button - Only show when authenticated */}
        {isAuthed && (
          <button
            className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>

      {/* Mobile Navigation - Only show when authenticated */}
      {isAuthed && (
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
              <button className="btn btn-outline" onClick={() => { handleLogout(); closeMenu(); }}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header