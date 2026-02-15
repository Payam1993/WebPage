/**
 * Erotic Brand - Navbar Component
 * Same structure as original but with dark BDSM theme
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Navbar.css'

const Navbar = ({ setCursorVariant }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const { language, changeLanguage, t } = useEroticLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const navLinks = [
    { name: t.nav.services, href: 'services' },
    { name: t.nav.about, href: 'about' },
    { name: t.nav.experience, href: 'experience' },
    { name: t.nav.testimonials, href: 'testimonials' },
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ca', name: 'Català' },
  ]

  return (
    <>
      <motion.nav 
        className={`erotic-navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="erotic-navbar-container">
          <a 
            href="#hero" 
            className="erotic-navbar-logo"
            onClick={(e) => handleNavClick(e, 'hero')}
          >
            <span className="erotic-logo-main">Confession</span>
            <span className="erotic-logo-sub">Erotic</span>
          </a>

          <ul className="erotic-navbar-links">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={`#${link.href}`}
                  className="erotic-nav-link erotic-animated-underline"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            {/* Language Selector */}
            <li className="erotic-lang-selector-wrapper">
              <button 
                className="erotic-lang-selector"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span className="erotic-lang-code">{language.toUpperCase()}</span>
                <svg 
                  className={`erotic-lang-arrow ${isLangOpen ? 'open' : ''}`}
                  width="10" 
                  height="10" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    className="erotic-lang-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`erotic-lang-option ${language === lang.code ? 'active' : ''}`}
                        onClick={() => {
                          changeLanguage(lang.code)
                          setIsLangOpen(false)
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Book Now Button */}
            <li>
              <a 
                href="#booking"
                className="erotic-btn erotic-btn-primary erotic-nav-cta"
                onClick={(e) => handleNavClick(e, 'booking')}
              >
                {t.nav.bookNow}
              </a>
            </li>

            {/* Staff Sign In */}
            <li>
              <Link to="/staff" className="erotic-nav-staff">
                Staff
              </Link>
            </li>
          </ul>

          <button 
            className={`erotic-menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              className="erotic-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              className="erotic-mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
            >
              <div className="erotic-mobile-menu-content">
                {/* Mobile Language Selector */}
                <div className="erotic-mobile-lang">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`erotic-mobile-lang-btn ${language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <ul className="erotic-mobile-links">
                  {navLinks.map((link, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <a 
                        href={`#${link.href}`}
                        onClick={(e) => handleNavClick(e, link.href)}
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <a 
                      href="#booking"
                      className="erotic-mobile-cta"
                      onClick={(e) => handleNavClick(e, 'booking')}
                    >
                      {t.nav.bookNow}
                    </a>
                  </motion.li>
                </ul>
                
                <motion.div 
                  className="erotic-mobile-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p>{t.nav.location}</p>
                  <p>+34 678 902 765</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
