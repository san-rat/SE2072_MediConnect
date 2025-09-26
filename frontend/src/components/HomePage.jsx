import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/827a7642-638b-4ce3-b70f-c34f15d66ad5.png';
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hospital-badge">
              <span className="hospital-icon">🏥</span>
              <h2>Dr. Dimantha Private Hospital</h2>
            </div>
            <h1>Excellence in Healthcare</h1>
            <p>
              Experience world-class medical care with our team of specialists. From emergency services to routine checkups, 
              we're committed to your health and wellness journey.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/appointments')}
              >
                🩺 Book Appointment
              </button>
              
            </div>
          </div>
          <div className="hero-media">
  <img
    className="hero-photo"
    src={heroImage}
    //alt="Modern Healthcare Facility"
  />

 

  <div className="media-badge">24/7 Emergency</div>
  <div className="media-chip">Certified General Practitioner</div>
</div>
        </div>
      </section>

      {/* Medical Services Section */}
      <section className="features">
        <div className="container">
          <h2>Comprehensive Medical Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🩺</div>
              <h3>General Medicine</h3>
              <p>Complete primary care services including routine checkups, preventive care, and treatment of common illnesses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Cardiology</h3>
              <p>Advanced cardiac care with state-of-the-art diagnostic equipment and experienced cardiologists.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Neurology</h3>
              <p>Specialized treatment for neurological conditions with cutting-edge technology and expert neurologists.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👶</div>
              <h3>Pediatrics</h3>
              <p>Comprehensive healthcare for children from infancy through adolescence with specialized pediatric care.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚑</div>
              <h3>Emergency Care</h3>
              <p>24/7 emergency services with rapid response team and fully equipped emergency department.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Laboratory Services</h3>
              <p>Complete diagnostic testing with advanced lab equipment and fast, accurate results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prescriptions Section */}
      <section id="prescriptions" className="prescriptions">
        <div className="container">
          <div className="prescriptions-content">
            <div className="prescriptions-text">
              <h2>Digital Prescription Management</h2>
              <p>
                Access and manage your prescriptions digitally with our secure platform. 
                Get electronic prescriptions, refill requests, and medication reminders all in one place.
              </p>
              <div className="prescription-features">
                <div className="prescription-feature">
                  <span className="feature-icon">📊</span>
                  <div>
                    <h4>Electronic Prescriptions</h4>
                    <p>Receive digital prescriptions directly from your doctor with detailed instructions.</p>
                  </div>
                </div>
                <div className="prescription-feature">
                  <span className="feature-icon">🔄</span>
                  <div>
                    <h4>Auto Refill Reminders</h4>
                    <p>Never miss your medication with automated refill notifications and reminders.</p>
                  </div>
                </div>
                <div className="prescription-feature">
                  <span className="feature-icon">📱</span>
                  <div>
                    <h4>Mobile Access</h4>
                    <p>Access your prescription history and current medications from anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="prescriptions-image">
              <div className="placeholder-image">
                <div className="image-content">
                  <span>📊</span>
                  <p>Prescription Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointments Section */}
      <section id="appointments" className="appointments">
        <div className="container">
          <h2>Easy Appointment Booking</h2>
          <div className="appointments-content">
            <div className="appointment-steps">
              <div className="appointment-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Choose Your Doctor</h3>
                  <p>Browse our network of qualified specialists and find the right doctor for your needs.</p>
                </div>
              </div>
              <div className="appointment-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Select Date & Time</h3>
                  <p>Pick a convenient date and time from available slots that fit your schedule.</p>
                </div>
              </div>
              <div className="appointment-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Confirm Booking</h3>
                  <p>Review your appointment details and confirm your booking with instant confirmation.</p>
                </div>
              </div>
            </div>
            <div className="appointment-features">
              <div className="appointment-feature-card">
                <span className="feature-icon">📅</span>
                <h4>24/7 Online Booking</h4>
                <p>Book appointments anytime, anywhere with our user-friendly online platform.</p>
              </div>
              <div className="appointment-feature-card">
                <span className="feature-icon">📲</span>
                <h4>SMS Reminders</h4>
                <p>Receive automated reminders via SMS and email before your appointment.</p>
              </div>
              <div className="appointment-feature-card">
                <span className="feature-icon">🚑</span>
                <h4>Emergency Slots</h4>
                <p>Priority booking available for urgent medical consultations and emergencies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section id="notifications" className="notifications">
        <div className="container">
          <h2>Stay Informed with Smart Notifications</h2>
          <div className="notifications-content">
            <div className="notification-types">
              <div className="notification-type">
                <div className="notification-icon">📅</div>
                <h3>Appointment Reminders</h3>
                <p>Get timely reminders for your upcoming appointments via SMS, email, or push notifications.</p>
              </div>
              <div className="notification-type">
                <div className="notification-icon">📊</div>
                <h3>Prescription Alerts</h3>
                <p>Receive notifications when your prescriptions are ready for pickup or need refills.</p>
              </div>
              <div className="notification-type">
                <div className="notification-icon">🏥</div>
                <h3>Health Updates</h3>
                <p>Stay updated with important health announcements, vaccination schedules, and hospital news.</p>
              </div>
            </div>
            <div className="notification-settings">
              <h3>Customize Your Notifications</h3>
              <div className="notification-options">
                <div className="notification-option">
                  <span className="option-icon">📧</span>
                  <div className="option-details">
                    <h4>Email Notifications</h4>
                    <p>Receive detailed updates and summaries via email</p>
                  </div>
                </div>
                <div className="notification-option">
                  <span className="option-icon">📱</span>
                  <div className="option-details">
                    <h4>SMS Alerts</h4>
                    <p>Get quick reminders and urgent updates via text message</p>
                  </div>
                </div>
                <div className="notification-option">
                  <span className="option-icon">🔔</span>
                  <div className="option-details">
                    <h4>Push Notifications</h4>
                    <p>Instant alerts through our mobile app for immediate attention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical News Section */}
      <section className="news-section">
        <div className="container">
          <h2>Latest Medical News & Updates</h2>
          <div className="news-grid">
            <div className="news-card featured">
              <div className="news-image">
                <span className="news-icon">🔬</span>
              </div>
              <div className="news-content">
                <div className="news-category">Research</div>
                <h3>Breakthrough in Heart Disease Treatment</h3>
                <p>New minimally invasive procedure shows 95% success rate in treating coronary artery disease with faster recovery times.</p>
                <div className="news-meta">
                  <span className="news-date">March 20, 2024</span>
                  <span className="news-author">Dr. Sarah Johnson</span>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="news-image">
                <span className="news-icon">💊</span>
              </div>
              <div className="news-content">
                <div className="news-category">Pharmacy</div>
                <h3>New Medication Guidelines Released</h3>
                <p>Updated protocols for diabetes management medications now available for all patients.</p>
                <div className="news-meta">
                  <span className="news-date">March 18, 2024</span>
                  <span className="news-author">Pharmacy Team</span>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="news-image">
                <span className="news-icon">🏥</span>
              </div>
              <div className="news-content">
                <div className="news-category">Hospital</div>
                <h3>New MRI Machine Installation</h3>
                <p>State-of-the-art MRI equipment now operational, reducing wait times for diagnostic imaging.</p>
                <div className="news-meta">
                  <span className="news-date">March 15, 2024</span>
                  <span className="news-author">Admin Team</span>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="news-image">
                <span className="news-icon">🦠</span>
              </div>
              <div className="news-content">
                <div className="news-category">Health Alert</div>
                <h3>Seasonal Flu Prevention Tips</h3>
                <p>Important guidelines to protect yourself and your family during flu season.</p>
                <div className="news-meta">
                  <span className="news-date">March 12, 2024</span>
                  <span className="news-author">Public Health</span>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="news-image">
                <span className="news-icon">👶</span>
              </div>
              <div className="news-content">
                <div className="news-category">Pediatrics</div>
                <h3>Child Vaccination Schedule Update</h3>
                <p>New vaccination recommendations for children under 5 years old.</p>
                <div className="news-meta">
                  <span className="news-date">March 10, 2024</span>
                  <span className="news-author">Pediatrics Dept</span>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="news-image">
                <span className="news-icon">🧠</span>
              </div>
              <div className="news-content">
                <div className="news-category">Neurology</div>
                <h3>Memory Care Program Launch</h3>
                <p>Comprehensive memory care services now available for patients with cognitive conditions.</p>
                <div className="news-meta">
                  <span className="news-date">March 8, 2024</span>
                  <span className="news-author">Neurology Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>No 68<br />Main Street, Kegalle, Sri Lanka</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+94 35 22 31449</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h4>Hours</h4>
                  <p>Mon - Fri: 8:00 AM - 8:00 PM<br />Sat - Sun: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
