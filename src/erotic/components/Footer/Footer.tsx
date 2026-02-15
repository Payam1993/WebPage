import React from 'react'
import './Footer.css'

/**
 * Footer - Footer component for the Erotic brand
 * 
 * Minimal, elegant footer with essential links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="erotic-footer">
      <div className="erotic-container">
        {/* Decorative Line */}
        <div className="erotic-footer-divider" />

        <div className="erotic-footer-content">
          {/* Brand */}
          <div className="erotic-footer-brand">
            <span className="erotic-footer-logo">Confession</span>
            <span className="erotic-footer-logo-accent">Erotic</span>
          </div>

          {/* Tagline */}
          <p className="erotic-footer-tagline">
            Where Desire Meets Discretion
          </p>

          {/* Contact */}
          <div className="erotic-footer-contact">
            <a href="tel:+34678902765" className="erotic-footer-link">
              +34 678 902 765
            </a>
            <span className="erotic-footer-separator">•</span>
            <span className="erotic-footer-location">Barcelona</span>
          </div>

          {/* Legal */}
          <div className="erotic-footer-legal">
            <p className="erotic-footer-copyright">
              © {currentYear} Confession Erotic. All rights reserved.
            </p>
            <p className="erotic-footer-disclaimer">
              Adults only (18+). By appointment only.
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="erotic-footer-ornament">
          <span>❧</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
