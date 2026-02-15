import React, { useState, useEffect } from 'react'
import './Navbar.css'

/**
 * Navbar - Navigation bar for the Erotic brand
 * 
 * Dark luxury design with elegant typography
 */
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { id: 'experience', label: 'Experience' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav className={`erotic-navbar ${isScrolled ? 'erotic-navbar--scrolled' : ''}`}>
      <div className="erotic-navbar-container">
        {/* Logo */}
        <div className="erotic-navbar-logo">
          <span className="erotic-navbar-logo-text">Confession</span>
          <span className="erotic-navbar-logo-accent">Erotic</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="erotic-navbar-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                className="erotic-navbar-link"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button 
          className="erotic-navbar-cta"
          onClick={() => scrollToSection('contact')}
        >
          Book Now
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className={`erotic-navbar-toggle ${isMobileMenuOpen ? 'erotic-navbar-toggle--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`erotic-navbar-mobile ${isMobileMenuOpen ? 'erotic-navbar-mobile--open' : ''}`}>
        <ul className="erotic-navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                className="erotic-navbar-mobile-link"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button 
              className="erotic-btn erotic-btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              Book Now
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
