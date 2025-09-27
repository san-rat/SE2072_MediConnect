import './ContactPage.css'

const ContactPage = () => {
  return (
    <main className="contact-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📞 Contact Us</h1>
          <p>Get in touch with Dr. Dimantha Private Hospital</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <span>📍</span>
              </div>
              <div className="contact-details">
                <h3>Address</h3>
                <p>
                  No.68<br />
                  Main Street, Kegalle, Sri Lanka<br />
                  Postal Code: 71000
                </p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span>📞</span>
              </div>
              <div className="contact-details">
                <h3>Phone Numbers</h3>
                <p>
                  Main: +94 35 22 31449<br />
                  
                </p>
              </div>
            </div>

           

            <div className="contact-card">
              <div className="contact-icon">
                <span>🕒</span>
              </div>
              <div className="contact-details">
                <h3>Operating Hours</h3>
                <p>
                  Monday - Friday: 8:00 AM - 8:00 PM<br />
                  Saturday: 8:00 AM - 6:00 PM<br />
                  Sunday: 9:00 AM - 5:00 PM<br />
                  Emergency: 24/7
                </p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="contact-form-card">
              <h3>Send us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="billing">Billing Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary btn-large">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="emergency-section">
          <div className="emergency-card">
            <div className="emergency-icon">
              <span>🚨</span>
            </div>
            <div className="emergency-content">
              <h3>Emergency Services</h3>
              <p>For medical emergencies, please call our 24/7 emergency hotline or visit our emergency department immediately.</p>
              <div className="emergency-actions">
                <button className="btn btn-danger btn-large">
                  <span>📞</span>
                  Call Emergency: +94 35 22 31449
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactPage
