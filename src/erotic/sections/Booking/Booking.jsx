/**
 * Erotic Brand - Booking Section
 * Same structure as original, uses existing backend via EroticBookingContext
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import { useEroticBooking } from '../../context/EroticBookingContext'
import './Booking.css'

const Booking = () => {
  const { t } = useEroticLanguage()
  const { openBookingModal } = useEroticBooking()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  return (
    <section id="booking" className="erotic-section erotic-booking-section" ref={sectionRef}>
      <div className="erotic-container">
        <div className="erotic-booking-grid">
          <motion.div 
            className="erotic-booking-content"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            <span className="erotic-section-overline">{t.booking.overline}</span>
            <h2>{t.booking.title}</h2>
            <p className="erotic-booking-description">{t.booking.description}</p>

            <div className="erotic-booking-info">
              <div className="erotic-info-item">
                <div className="erotic-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="erotic-info-text">
                  <span className="erotic-info-label">{t.booking.location}</span>
                  <span className="erotic-info-value">Gothic Quarter, Barcelona</span>
                </div>
              </div>

              <div className="erotic-info-item">
                <div className="erotic-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div className="erotic-info-text">
                  <span className="erotic-info-label">{t.booking.phone}</span>
                  <a href="tel:+34678902765" className="erotic-info-value">+34 678 902 765</a>
                </div>
              </div>

              <div className="erotic-info-item">
                <div className="erotic-info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="erotic-info-text">
                  <span className="erotic-info-label">WhatsApp</span>
                  <a href="https://wa.me/34678902765" target="_blank" rel="noopener noreferrer" className="erotic-info-value">
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="erotic-booking-cta"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="erotic-cta-card">
              <h3>Ready to Surrender?</h3>
              <p>Request your session and begin your journey into exquisite control.</p>
              <button 
                className="erotic-btn erotic-btn-primary"
                onClick={() => openBookingModal()}
              >
                Request Session
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <p className="erotic-cta-note">Complete discretion guaranteed</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="erotic-corner-ornament top-left" />
      <div className="erotic-corner-ornament top-right" />
      <div className="erotic-corner-ornament bottom-left" />
      <div className="erotic-corner-ornament bottom-right" />
    </section>
  )
}

export default Booking
