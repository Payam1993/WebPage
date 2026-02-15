import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

const Navbar = ({ setCursorVariant }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const { language, changeLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.testimonials, href: '#testimonials' },
    { name: t.nav.bookNow, href: '#booking' },
  ]

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: (
        <svg viewBox="0 0 60 30" className="flag-icon">
          <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
        </svg>
      )
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: (
        <svg viewBox="0 0 750 500" className="flag-icon">
          <rect width="750" height="500" fill="#c60b1e"/>
          <rect width="750" height="250" y="125" fill="#ffc400"/>
        </svg>
      )
    },
    { 
      code: 'ca', 
      name: 'Català', 
      flag: (
        <svg viewBox="0 0 810 540" className="flag-icon">
          <rect width="810" height="540" fill="#FCDD09"/>
          <path stroke="#DA121A" strokeWidth="60" d="M0,90H810 M0,210H810 M0,330H810 M0,450H810"/>
        </svg>
      )
    },
  ]

  const currentLang = languages.find(l => l.code === language)

  const menuVariants = {
    closed: {
      x: '100%',
      transition: { type: 'tween', duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    open: {
      x: 0,
      transition: { type: 'tween', duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: 0.3 + i * 0.1, duration: 0.5 }
    })
  }

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="navbar-container">
          <Link 
            to="/" 
            className="navbar-logo"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="logo-main">Confession</span>
            <span className="logo-sub">Barcelona</span>
          </Link>

          <ul className="navbar-links">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.href}
                  className="nav-link animated-underline"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            {/* Language Selector */}
            <li className="lang-selector-wrapper">
              <button 
                className="lang-selector"
                onClick={() => setIsLangOpen(!isLangOpen)}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <span className="lang-flag">{currentLang?.flag}</span>
                <span className="lang-code">{language.toUpperCase()}</span>
                <svg 
                  className={`lang-arrow ${isLangOpen ? 'open' : ''}`}
                  width="12" 
                  height="12" 
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
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`lang-option ${language === lang.code ? 'active' : ''}`}
                        onClick={() => {
                          changeLanguage(lang.code)
                          setIsLangOpen(false)
                        }}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        <span className="lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          <button 
            className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              className="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-content">
                {/* Mobile Language Selector */}
                <div className="mobile-lang-selector">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`mobile-lang-btn ${language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>

                <ul className="mobile-menu-links">
                  {navLinks.map((link, i) => (
                    <motion.li 
                      key={i}
                      variants={linkVariants}
                      custom={i}
                      initial="closed"
                      animate="open"
                    >
                      <a 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  className="mobile-menu-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
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
