import { useState } from 'react'
import './Header.css'

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-mark" aria-label="Hospital" role="img">🏥</span>
          <h1>MediConnect</h1>
          <span className="tagline">Smart Appointments. Better Care</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li><a href="#home" className="nav-link active">HOME</a></li>
            <li><a href="#about" className="nav-link">ABOUT US</a></li>
            <li><a href="#doctors" className="nav-link">DOCTORS</a></li>
            <li><a href="#news" className="nav-link">NEWS</a></li>
            <li><a href="#contact" className="nav-link">CONTACT</a></li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="btn btn-outline" onClick={onLoginClick}>
            Login
          </button>
          <button className="btn btn-primary" onClick={onRegisterClick}>
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links-mobile">
          <li><a href="#home" className="nav-link" onClick={closeMenu}>HOME</a></li>
          <li><a href="#about" className="nav-link" onClick={closeMenu}>ABOUT US</a></li>
          <li><a href="#doctors" className="nav-link" onClick={closeMenu}>DOCTORS</a></li>
          <li><a href="#news" className="nav-link" onClick={closeMenu}>NEWS</a></li>
          <li><a href="#contact" className="nav-link" onClick={closeMenu}>CONTACT</a></li>
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
