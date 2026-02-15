import React from 'react'
import './Contact.css'

/**
 * Contact - Call-to-action section for the Erotic brand
 * 
 * Exclusive booking invitation with contact options
 */
const Contact: React.FC = () => {
  const phoneNumber = '+34 678 902 765'
  const whatsappLink = 'https://wa.me/34678902765'

  return (
    <section id="contact" className="erotic-contact">
      {/* Background Effects */}
      <div className="erotic-contact-bg">
        <div className="erotic-contact-glow" />
      </div>

      <div className="erotic-container">
        <div className="erotic-contact-content">
          {/* Header */}
          <div className="erotic-contact-header">
            <span className="erotic-contact-label">Begin Your Journey</span>
            <h2 className="erotic-contact-title">
              Ready to <span className="erotic-accent-text">Surrender?</span>
            </h2>
            <p className="erotic-contact-subtitle">
              All sessions are by appointment only. Contact us for a 
              discreet consultation to discuss your desires and customize 
              your experience.
            </p>
          </div>

          {/* Contact Options */}
          <div className="erotic-contact-options">
            {/* WhatsApp */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="erotic-contact-option erotic-contact-option--whatsapp"
            >
              <div className="erotic-contact-option-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="erotic-contact-option-content">
                <span className="erotic-contact-option-label">Message Us</span>
                <span className="erotic-contact-option-value">WhatsApp</span>
              </div>
              <span className="erotic-contact-option-arrow">→</span>
            </a>

            {/* Phone */}
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="erotic-contact-option erotic-contact-option--phone"
            >
              <div className="erotic-contact-option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="erotic-contact-option-content">
                <span className="erotic-contact-option-label">Call Us</span>
                <span className="erotic-contact-option-value">{phoneNumber}</span>
              </div>
              <span className="erotic-contact-option-arrow">→</span>
            </a>
          </div>

          {/* Additional Info */}
          <div className="erotic-contact-info">
            <div className="erotic-contact-info-item">
              <span className="erotic-contact-info-label">Location</span>
              <span className="erotic-contact-info-value">Barcelona, Spain</span>
            </div>
            <div className="erotic-contact-info-divider" />
            <div className="erotic-contact-info-item">
              <span className="erotic-contact-info-label">Hours</span>
              <span className="erotic-contact-info-value">By Appointment</span>
            </div>
            <div className="erotic-contact-info-divider" />
            <div className="erotic-contact-info-item">
              <span className="erotic-contact-info-label">Policy</span>
              <span className="erotic-contact-info-value">Adults Only (18+)</span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="erotic-contact-disclaimer">
            Your inquiry will be handled with complete discretion. 
            We never share client information.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Contact
