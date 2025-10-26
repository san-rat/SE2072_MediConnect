import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Header.css'

const Header = ({ onLoginClick, onRegisterClick, onAdminLoginClick, isModalOpen, currentPage, onPageChange, user, onDarkModeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('mc_token'))
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('mc_dark_mode') === 'true')
  const navigate = useNavigate();

  // Update authentication state when user changes
  useEffect(() => {
    setIsAuthed(!!user);
  }, [user]);

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

  // Dark mode is now managed by the parent App component

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('mc_dark_mode', newDarkMode.toString())
    // Notify parent component about dark mode change
    if (onDarkModeToggle) {
      onDarkModeToggle(newDarkMode)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('mc_token')
    localStorage.removeItem('mc_token_type')
    localStorage.removeItem('mc_role')
    setIsAuthed(false)
    window.location.reload()
  }

  return (
    <header className={`header ${isAuthed ? 'authenticated' : 'unauthenticated'} ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => { navigate('/'); onPageChange('home'); closeMenu(); }} style={{ cursor: 'pointer' }}>
          <span className="logo-mark" aria-label="Hospital" role="img"></span>
          <h1>MediConnect</h1>
        </div>

        {/* Desktop Navigation - Only show when authenticated */}
        {isAuthed && (
          <nav className="nav-desktop">
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  onClick={() => { navigate('/'); onPageChange('home'); closeMenu(); }}
                >
                  {user?.role === 'DOCTOR' ? 'DASHBOARD' : 'HOME'}
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${currentPage === 'prescriptions' ? 'active' : ''}`}
                  onClick={() => { navigate('/prescriptions'); onPageChange('prescriptions'); closeMenu(); }}
                >
                  PRESCRIPTIONS
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${currentPage === 'medical-records' ? 'active' : ''}`}
                  onClick={() => { navigate('/medical-records'); onPageChange('medical-records'); closeMenu(); }}
                >
                  MEDICAL RECORDS
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${currentPage === 'appointments' ? 'active' : ''}`}
                  onClick={() => { navigate('/appointments'); onPageChange('appointments'); closeMenu(); }}
                >
                  APPOINTMENTS
                </button>
              </li>
              {user?.role === 'DOCTOR' && (
                <li>
                  <button 
                    className={`nav-link ${currentPage === 'patients' ? 'active' : ''}`}
                    onClick={() => { navigate('/patients'); onPageChange('patients'); closeMenu(); }}
                  >
                    PATIENTS
                  </button>
                </li>
              )}
              <li>
                <button 
                  className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
                  onClick={() => { navigate('/notifications'); onPageChange('notifications'); closeMenu(); }}
                >
                  NOTIFICATIONS
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                  onClick={() => { navigate('/contact'); onPageChange('contact'); closeMenu(); }}
                >
                  CONTACT
                </button>
              </li>
              {user?.role === 'PATIENT' && (
                <li>
                  <button 
                    className={`nav-link ${currentPage === 'feedback' ? 'active' : ''}`}
                    onClick={() => { navigate('/feedback'); onPageChange('feedback'); closeMenu(); }}
                  >
                    FEEDBACK
                  </button>
                </li>
              )}
              <li>
                <button 
                  className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                  onClick={() => { navigate('/profile'); onPageChange('profile'); closeMenu(); }}
                >
                  PROFILE
                </button>
              </li>
            </ul>
          </nav>
        )}

        {/* User Info & Auth Buttons */}
        <div className="auth-buttons">
          {/* Dark Mode Toggle */}
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthed ? (
            <div className="user-info">
              {user && (
                <div className="user-role">
                  <span className={`role-badge ${user.role?.toLowerCase()}`}>
                    {user.role === 'DOCTOR' ? '👨‍⚕️ Doctor' : user.role === 'PATIENT' ? '👤 Patient' : '👤 User'}
                  </span>
                </div>
              )}
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
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
              <button
                className="btn btn-admin"
                onClick={() => { closeMenu(); onAdminLoginClick(); }}
                title="Admin Access"
              >
                🔐 Admin
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

        {/* Profile Icon Button */}
        {user && (
          <button
            className="profile-icon-btn"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
          >
            <img
              src={user.avatar || '/default-profile.svg'}
              alt="Profile"
              className="profile-icon"
            />
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
                onClick={() => { navigate('/'); onPageChange('home'); closeMenu(); }}
              >
                {user?.role === 'DOCTOR' ? 'DASHBOARD' : 'HOME'}
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'prescriptions' ? 'active' : ''}`}
                onClick={() => { navigate('/prescriptions'); onPageChange('prescriptions'); closeMenu(); }}
              >
                PRESCRIPTIONS
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'medical-records' ? 'active' : ''}`}
                onClick={() => { navigate('/medical-records'); onPageChange('medical-records'); closeMenu(); }}
              >
                MEDICAL RECORDS
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'appointments' ? 'active' : ''}`}
                onClick={() => { navigate('/appointments'); onPageChange('appointments'); closeMenu(); }}
              >
                APPOINTMENTS
              </button>
            </li>
            {user?.role === 'DOCTOR' && (
              <li>
                <button 
                  className={`nav-link ${currentPage === 'patients' ? 'active' : ''}`}
                  onClick={() => { navigate('/patients'); onPageChange('patients'); closeMenu(); }}
                >
                  PATIENTS
                </button>
              </li>
            )}
            <li>
              <button
                  className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
                  onClick={() => {
                    // Route user to their correct notifications page
                    if (user?.role === 'DOCTOR') {
                      navigate('/notifications'); // DoctorNotificationsPage
                    } else if (user?.role === 'ADMIN') {
                      navigate('/notifications'); // AdminNotificationsPage
                    } else {
                      navigate('/notifications'); // PatientNotificationsPage
                    }
                    onPageChange('notifications');
                    closeMenu();
                  }}
              >
                NOTIFICATIONS
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => { navigate('/contact'); onPageChange('contact'); closeMenu(); }}
              >
                CONTACT
              </button>
            </li>
            {user?.role === 'PATIENT' && (
              <li>
                <button 
                  className={`nav-link ${currentPage === 'feedback' ? 'active' : ''}`}
                  onClick={() => { navigate('/feedback'); onPageChange('feedback'); closeMenu(); }}
                >
                  FEEDBACK
                </button>
              </li>
            )}
            <li>
              <button 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => { navigate('/profile'); onPageChange('profile'); closeMenu(); }}
              >
                PROFILE
              </button>
            </li>

            <li className="mobile-auth-buttons">
              <button
                className="dark-mode-toggle mobile"
                onClick={() => { toggleDarkMode(); closeMenu(); }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
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