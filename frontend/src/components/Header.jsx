import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import { Button } from "../components/ui/button"
import "./Header.css"

const Header = ({ onLoginClick, onRegisterClick, isModalOpen, currentPage, onPageChange, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("mc_token"))
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Auto-close menu when modal opens
  useEffect(() => {
    if (isModalOpen) setIsMenuOpen(false)
  }, [isModalOpen])

  // Listen for auth changes (other tabs login/logout)
  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem("mc_token"))
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("mc_token")
    localStorage.removeItem("mc_token_type")
    localStorage.removeItem("mc_role")
    setIsAuthed(false)
    window.location.reload()
  }

  return (
      <header className={`header ${isAuthed ? "authenticated" : "unauthenticated"}`}>
        <div className="header-container">

          {/* Logo + Branding */}
          <Link to="/" className="logo">
            <img src="/MediConnectt.png" alt="MediConnect Logo" />
            <div>
              <h1>MediConnect</h1>
              <p className="tagline">Smart Healthcare Appointment & Awareness System</p>
            </div>
          </Link>

          {/* Navigation - Only when logged in */}
          {isAuthed && (
              <nav className="nav-desktop" aria-label="Primary">
                <ul className="nav-links">
                  {["home", "prescriptions", "appointments", "notifications", "contact", "profile"].map((page) => (
                    <li key={page}>
                      <button
                          className={`nav-link ${currentPage === page ? "active" : ""}`}
                          onClick={() => {
                            navigate(page === "home" ? "/" : `/${page}`)
                            onPageChange(page)
                            closeMenu()
                          }}
                      >
                        {page.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
          )}

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {isAuthed ? (
                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            ) : (
                <>
                  <Button
                      className="bg-[#0D8FAC] hover:bg-[#075A6B] text-white font-medium"
                      onClick={() => { closeMenu(); onLoginClick?.() }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <button className="btn btn-primary" onClick={() => { closeMenu(); onRegisterClick?.() }}>
                    Register
                  </button>
                </>
            )}

            {/* Mobile Menu Button */}
            {isAuthed && (
                <button
                    className={`mobile-menu-btn ${isMenuOpen ? "open" : ""}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                >
                  <span></span><span></span><span></span>
                </button>
            )}

            {/* Profile Icon */}
            {user && (
                <button className="profile-icon-btn" onClick={() => navigate("/profile")} aria-label="Profile">
                  <img src={user.avatar || "/default-profile.svg"} alt="Profile" className="profile-icon" />
                </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthed && (
            <nav id="primary-navigation" className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
              <ul className="nav-links-mobile">
                {["home", "prescriptions", "appointments", "notifications", "contact", "profile"].map((page) => (
                    <li key={page}>
                      <button
                          className={`nav-link ${currentPage === page ? "active" : ""}`}
                          onClick={() => {
                            navigate(page === "home" ? "/" : `/${page}`)
                            onPageChange(page)
                            closeMenu()
                          }}
                      >
                        {page.toUpperCase()}
                      </button>
                    </li>
                ))}
                <li className="mobile-auth-buttons">
                  <button className="btn btn-outline" onClick={() => { handleLogout(); closeMenu() }}>
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
