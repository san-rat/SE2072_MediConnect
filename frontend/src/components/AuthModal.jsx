import { useState, useEffect } from 'react'
import { login, registerPatient, registerDoctor } from "../services/auth"  // ⬅️ uses your services

/**
 * Modern landing + auth component (full-screen hero with CTA bar)
 * - Sticky navbar
 * - Big hero with circular image area
 * - Wavy action bar with CTAs
 * - Slide-in glass panels for Login / Registration (patient or doctor)
 */

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

const BRAND_BLUE = '#0a66c2'
const BRAND_TEAL = '#12b886'
const DARK = '#2f3944'
const LIGHT = '#ffffff'

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 40,
    background: 'linear-gradient(135deg, #f7fbff 0%, #eef6ff 35%, #f8fffd 100%)',
    display: 'flex', flexDirection: 'column'
  },
  navbar: {
    position: 'sticky', top: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px clamp(16px, 4vw, 24px)',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'saturate(180%) blur(12px)',
    borderBottom: '1px solid rgba(10,102,194,0.06)',
    minHeight: '60px'
  },
  brand: { 
    display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', 
    fontWeight: 800, color: BRAND_BLUE, letterSpacing: 1,
    fontSize: 'clamp(16px, 3vw, 20px)'
  },
  logo: { width: 'clamp(28px, 5vw, 36px)', height: 'clamp(28px, 5vw, 36px)', objectFit: 'contain' },
  nav: { 
    display: 'flex', 
    gap: 'clamp(8px, 2vw, 20px)', 
    color: DARK, 
    fontWeight: 600,
    alignItems: 'center'
  },
  navBtn: { 
    border: 'none', 
    background: 'transparent', 
    color: DARK, 
    cursor: 'pointer',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    padding: '8px 4px',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease'
  },
  mobileMenuBtn: {
    display: 'none',
    border: 'none',
    background: 'transparent',
    color: DARK,
    cursor: 'pointer',
    fontSize: '24px',
    padding: '8px'
  },
  mobileNav: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'saturate(180%) blur(12px)',
    borderBottom: '1px solid rgba(10,102,194,0.06)',
    flexDirection: 'column',
    padding: '16px',
    gap: '12px'
  },
  mobileNavOpen: {
    display: 'flex'
  },
  hero: {
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    alignItems: 'center', 
    gap: 'clamp(16px, 4vw, 24px)',
    padding: 'clamp(24px, 6vw, 48px) clamp(16px, 4vw, 56px)',
    minHeight: '60vh'
  },
  circleWrap: { position: 'relative', width: 'min(560px, 80vw)', aspectRatio: '1/1', margin: '0 auto' },
  circle: {
    position: 'absolute', inset: 0, borderRadius: '50%',
    background: `radial-gradient(90% 90% at 30% 30%, ${BRAND_BLUE} 0%, #5ca8ea 35%, #eaf4ff 80%)`
  },
  doctors: { position: 'absolute', inset: 0, objectFit: 'contain', width: '100%', height: '100%' },
  quoteWrap: { display: 'flex', justifyContent: 'center' },
  quoteCard: {
    maxWidth: 560, color: DARK, fontSize: 36, lineHeight: 1.2, fontWeight: 700,
    background: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 24,
    boxShadow: '0 10px 30px rgba(31,41,55,0.08)',
    backdropFilter: 'blur(6px)'
  },
  wave: { position: 'relative', marginTop: 24 },
  waveBand: {
    background: BRAND_BLUE,
    color: LIGHT,
    display: 'flex', justifyContent: 'center',
    padding: '18px clamp(12px, 3vw, 24px)',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    clipPath: 'path("M0,50 C200,0 400,100 600,50 C800,0 1000,100 1200,50 L1200,200 L0,200 Z")'
  },
  ctas: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
    gap: 'clamp(8px, 2vw, 12px)', 
    width: 'min(1100px, 96vw)',
    maxWidth: '100%'
  },
  cta: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.12)', padding: '14px 16px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer',
    fontWeight: 600
  },
  ctaIcon: { fontSize: 18 },
  footer: { textAlign: 'center', color: '#6b7785', fontSize: 12, padding: '10px 0 18px' },

  // Panels
  panelScrim: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)', zIndex: 60,
    display: 'flex', justifyContent: 'flex-end'
  },
  panel: {
    width: 'min(560px, 92vw)',
    height: '100%',
    background: LIGHT,
    borderLeft: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '-16px 0 40px rgba(2,6,23,0.15)',
    display: 'flex',
    flexDirection: 'column',

    // 🔥 slide-in baseline (off-screen by default)
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out'
  },
  panelHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #eef2f7' },
  panelTitle: { fontWeight: 800, color: DARK, letterSpacing: 0.2 },
  backBtn: { border: 'none', background: 'transparent', color: BRAND_BLUE, fontWeight: 700, cursor: 'pointer' },
  panelBody: { padding: 20, overflow: 'auto' },
  segWrap: { display: 'flex', gap: 8, background: '#f1f5f9', padding: 6, borderRadius: 12, width: 'fit-content' },
  segBtn: (active) => ({
    border: 'none', cursor: 'pointer', padding: '10px 14px', borderRadius: 8,
    background: active ? LIGHT : 'transparent', color: active ? DARK : '#475569',
    fontWeight: 700, boxShadow: active ? '0 1px 2px rgba(2,6,23,0.08)' : 'none'
  }),
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 },
  label: { fontSize: 13, color: '#475569', fontWeight: 700 },
  input: {
    border: '1px solid #d7dfeb', padding: '12px 12px', borderRadius: 10,
    outline: 'none', fontSize: 14
  },
  error: { color: '#c62828', fontSize: 12, marginTop: 4 },
  submit: {
    marginTop: 8, border: 'none', padding: '12px 16px', borderRadius: 10,
    background: BRAND_BLUE, color: LIGHT, fontWeight: 800, cursor: 'pointer'
  },
  link: { border: 'none', background: 'transparent', color: BRAND_BLUE, cursor: 'pointer', fontWeight: 700 }
}

const AuthModal = ({ isOpen, onClose, initialMode = 'hero' }) => {
  // modes: 'hero' | 'login' | 'register'
  const [mode, setMode] = useState(initialMode)
  const [userType, setUserType] = useState('patient')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ ...FIELD_DEFAULTS })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isLogin = mode === 'login'

  // ✅ Lock body scroll when modal is open
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

  // Responsive check
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const validateForm = () => {
    if (mode === 'hero') return true
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
        window.location.reload() // refresh header auth state
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
            yearsExperience: 0,      // adjust to your DTO if required
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

  const goHero = () => {
    setMode('hero'); setUserType('patient'); setErrors({}); setFormData({ ...FIELD_DEFAULTS })
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* NAVBAR */}
      <div style={styles.navbar} onClick={(e) => e.stopPropagation()}>
        <div style={styles.brand}>
          <img src="/logo.png" alt="MediConnect" style={styles.logo} />
          <span>MediConnect</span>
        </div>
        <div style={{...styles.nav, display: isMobile ? 'none' : 'flex'}}>
          <button style={styles.navBtn}>Why Us</button>
          <button style={styles.navBtn}>Specialities</button>
          <button style={styles.navBtn}>Services</button>
          <button style={styles.navBtn} onClick={() => setMode('login')}>Consult</button>
          <button style={{...styles.navBtn, color: BRAND_TEAL}} onClick={() => setMode('register')}>Register</button>
        </div>
        <button 
          style={{...styles.mobileMenuBtn, display: isMobile ? 'block' : 'none'}}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div style={{
          ...styles.mobileNav,
          display: isMobile && isMobileMenuOpen ? 'flex' : 'none'
        }}>
          <button style={{...styles.navBtn, textAlign: 'left', width: '100%'}}>Why Us</button>
          <button style={{...styles.navBtn, textAlign: 'left', width: '100%'}}>Specialities</button>
          <button style={{...styles.navBtn, textAlign: 'left', width: '100%'}}>Services</button>
          <button 
            style={{...styles.navBtn, textAlign: 'left', width: '100%'}} 
            onClick={() => { setMode('login'); setIsMobileMenuOpen(false) }}
          >
            Consult
          </button>
          <button 
            style={{...styles.navBtn, color: BRAND_TEAL, textAlign: 'left', width: '100%'}} 
            onClick={() => { setMode('register'); setIsMobileMenuOpen(false) }}
          >
            Register
          </button>
        </div>
      </div>

      {/* HERO */}
      <section style={styles.hero} onClick={(e) => e.stopPropagation()}>
        <div style={styles.circleWrap}>
          <div style={styles.circle} />
          <img src="/hero-doctors.png" alt="" style={styles.doctors} />
        </div>
        <div style={styles.quoteWrap}>
          <div style={styles.quoteCard}>
            “We Provide World-Class Facilities for the Very Best Healthcare”
          </div>
        </div>
      </section>

      {/* ACTION BAR */}
      <section style={styles.wave} onClick={(e) => e.stopPropagation()}>
        <div style={styles.waveBand}>
          <div style={styles.ctas}>
            <button style={styles.cta} onClick={() => setMode('login')}>
              <span style={styles.ctaIcon}>👩‍⚕️</span> Consult Doctor
            </button>
            <button style={styles.cta} onClick={() => console.log('Make a Payment')}>
              <span style={styles.ctaIcon}>💳</span> Make a Payment
            </button>
            <button style={styles.cta} onClick={() => console.log('Emergency Services')}>
              <span style={styles.ctaIcon}>🆘</span> Emergency Services
            </button>
            <button style={styles.cta} onClick={() => console.log('Laboratory Reports')}>
              <span style={styles.ctaIcon}>⚗️</span> Laboratory Reports
            </button>
            <button style={styles.cta} onClick={() => setMode('register')}>
              <span style={styles.ctaIcon}>📝</span> Patient Registration
            </button>
          </div>
        </div>
        <div style={styles.footer}>© {new Date().getFullYear()} MediConnect. All rights reserved.</div>
      </section>

      {/* PANELS */}
      {mode !== 'hero' && (
        <div style={styles.panelScrim} onClick={goHero}>
          <aside
            style={{
              ...styles.panel,
              // 👇 visible position when the panel is mounted
              transform: 'translateX(0)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.panelHead}>
              <button style={styles.backBtn} onClick={goHero}>← Back</button>
              <h3 style={styles.panelTitle}>{isLogin ? 'Consult Doctor – Sign in' : 'Create your account'}</h3>
              <div />
            </div>

            {!isLogin && (
              <div style={{ ...styles.panelBody, paddingBottom: 0 }}>
                <div style={styles.segWrap}>
                  <button style={styles.segBtn(userType === 'patient')} onClick={() => setUserType('patient')}>Patient</button>
                  <button style={styles.segBtn(userType === 'doctor')} onClick={() => setUserType('doctor')}>Doctor</button>
                </div>
              </div>
            )}

            <form style={styles.panelBody} onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="firstName">First name</label>
                    <input style={styles.input} id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="lastName">Last name</label>
                    <input style={styles.input} id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}
                  </div>
                </div>
              )}

              <div style={styles.field}>
                <label style={styles.label} htmlFor="email">Email</label>
                <input style={styles.input} id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                {errors.email && <p style={styles.error}>{errors.email}</p>}
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="password">Password</label>
                  <input style={styles.input} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
                  {errors.password && <p style={styles.error}>{errors.password}</p>}
                </div>
                {!isLogin && (
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="confirmPassword">Confirm password</label>
                    <input style={styles.input} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                    {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
                  </div>
                )}
              </div>

              {!isLogin && (
                <>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="phone">Phone</label>
                    <input style={styles.input} id="phone" name="phone" type="tel" placeholder="+94 7X XXX XXXX" value={formData.phone} onChange={handleInputChange} />
                    {errors.phone && <p style={styles.error}>{errors.phone}</p>}
                  </div>

                  {userType === 'doctor' && (
                    <div style={styles.row}>
                      <div style={styles.field}>
                        <label style={styles.label} htmlFor="specialization">Specialization</label>
                        <select style={styles.input} id="specialization" name="specialization" value={formData.specialization} onChange={handleInputChange}>
                          <option value="">Select specialization</option>
                          <option>Cardiology</option>
                          <option>Dermatology</option>
                          <option>Pediatrics</option>
                          <option>Orthopedics</option>
                          <option>Neurology</option>
                        </select>
                        {errors.specialization && <p style={styles.error}>{errors.specialization}</p>}
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label} htmlFor="licenseNumber">License number</label>
                        <input style={styles.input} id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} />
                        {errors.licenseNumber && <p style={styles.error}>{errors.licenseNumber}</p>}
                      </div>
                    </div>
                  )}

                  {userType === 'patient' && (
                    <div style={styles.row}>
                      <div style={styles.field}>
                        <label style={styles.label} htmlFor="dateOfBirth">Date of birth</label>
                        <input style={styles.input} id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                        {errors.dateOfBirth && <p style={styles.error}>{errors.dateOfBirth}</p>}
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label} htmlFor="emergencyContact">Emergency contact</label>
                        <input style={styles.input} id="emergencyContact" name="emergencyContact" placeholder="Name / Phone" value={formData.emergencyContact} onChange={handleInputChange} />
                        {errors.emergencyContact && <p style={styles.error}>{errors.emergencyContact}</p>}
                      </div>
                    </div>
                  )}
                </>
              )}

              <button type="submit" style={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? (isLogin ? 'Signing in…' : 'Creating account…') : (isLogin ? 'Sign in' : 'Create account')}
              </button>

              <p style={{ marginTop: 10, color: '#6b7280', fontSize: 13 }}>
                {isLogin ? (
                  <>New here? <button type="button" style={styles.link} onClick={() => setMode('register')}>Create a patient account</button></>
                ) : (
                  <>Already have an account? <button type="button" style={styles.link} onClick={() => setMode('login')}>Sign in</button></>
                )}
              </p>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}

export default AuthModal