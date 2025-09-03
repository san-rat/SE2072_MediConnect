import './HomePage.css'

const HomePage = () => {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Your Health, Our Priority</h1>
            <p>
              Connect with qualified doctors, book appointments seamlessly, and take control of your healthcare journey with MediConnect.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large">Book Appointment</button>
              <button className="btn btn-outline btn-large">Find Doctors</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <div className="image-content">
                <span>🏥</span>
                <p>Medical Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose MediConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Scheduling</h3>
              <p>Book appointments with your preferred doctors at your convenience, 24/7 online booking system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👩‍⚕️</div>
              <h3>Qualified Doctors</h3>
              <p>Connect with licensed and experienced healthcare professionals across various specializations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your medical information is protected with industry-standard security and privacy measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About MediConnect</h2>
              <p>
                MediConnect is a revolutionary healthcare platform designed to bridge the gap between patients and healthcare providers. 
                Our mission is to make quality healthcare accessible, convenient, and efficient for everyone.
              </p>
              <p>
                With our smart appointment system, you can easily find and book appointments with qualified doctors, 
                manage your medical records, and stay connected with your healthcare providers.
              </p>
              <ul>
                <li>✓ Verified Doctors</li>
                <li>✓ Medical Specializations</li>
                <li>✓ 24/7 Customer Support</li>
                <li>✓ Secure Digital Health Records</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="placeholder-image">
                <div className="image-content">
                  <span>⚕️</span>
                  <p>Healthcare Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors">
        <div className="container">
          <h2>Meet Our Top Doctors</h2>
          <div className="doctors-grid">
            <div className="doctor-card">
              <div className="doctor-image">
                <div className="placeholder-image">
                  <span>👨‍⚕️</span>
                </div>
              </div>
              <h3>Dr. John Smith</h3>
              <p className="specialization">Cardiologist</p>
              <p className="experience">15+ Years Experience</p>
              <button className="btn btn-outline btn-small">View Profile</button>
            </div>
            <div className="doctor-card">
              <div className="doctor-image">
                <div className="placeholder-image">
                  <span>👩‍⚕️</span>
                </div>
              </div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="specialization">Dermatologist</p>
              <p className="experience">12+ Years Experience</p>
              <button className="btn btn-outline btn-small">View Profile</button>
            </div>
            <div className="doctor-card">
              <div className="doctor-image">
                <div className="placeholder-image">
                  <span>👨‍⚕️</span>
                </div>
              </div>
              <h3>Dr. Michael Brown</h3>
              <p className="specialization">Pediatrician</p>
              <p className="experience">10+ Years Experience</p>
              <button className="btn btn-outline btn-small">View Profile</button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="news">
        <div className="container">
          <h2>Latest Health News</h2>
          <div className="news-grid">
            <div className="news-card">
              <div className="news-image">
                <div className="placeholder-image">
                  <span>📰</span>
                </div>
              </div>
              <div className="news-content">
                <span className="news-date">March 15, 2024</span>
                <h3>New Telemedicine Services Now Available</h3>
                <p>Connect with doctors remotely through our new telemedicine platform for non-emergency consultations.</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
            </div>
            <div className="news-card">
              <div className="news-image">
                <div className="placeholder-image">
                  <span>🩺</span>
                </div>
              </div>
              <div className="news-content">
                <span className="news-date">March 10, 2024</span>
                <h3>Preventive Health Checkup Packages</h3>
                <p>New comprehensive health screening packages now available at discounted rates for early detection.</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
            </div>
            <div className="news-card">
              <div className="news-image">
                <div className="placeholder-image">
                  <span>💊</span>
                </div>
              </div>
              <div className="news-content">
                <span className="news-date">March 5, 2024</span>
                <h3>Mental Health Awareness Campaign</h3>
                <p>Join our mental health awareness initiative with free consultations and educational workshops.</p>
                <a href="#" className="read-more">Read More →</a>
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
                  <p>123 Healthcare Street<br />Medical District, City 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@mediconnect.com</p>
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
