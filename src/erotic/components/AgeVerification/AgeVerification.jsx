/**
 * Erotic Brand - Age Verification Component
 * Clean, elegant design
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './AgeVerification.css'

const AgeVerification = ({ onVerify }) => {
  const { t, language, changeLanguage } = useEroticLanguage()
  const [isChecked, setIsChecked] = useState(false)

  const handleEnter = () => {
    if (isChecked && onVerify) {
      localStorage.setItem('erotic_age_verified', 'true')
      localStorage.setItem('erotic_age_verified_date', new Date().toISOString())
      onVerify(true)
    }
  }

  const handleExit = () => {
    if (onVerify) {
      onVerify(false)
    } else {
      window.location.href = 'https://www.google.com'
    }
  }

  return (
    <div className="erotic-age-gate">
      {/* Background gradient */}
      <div className="erotic-age-gate-bg" />

      {/* Language selector */}
      <div className="erotic-age-gate-lang">
        {['en', 'es', 'ca'].map((lang, i) => (
          <span key={lang}>
            {i > 0 && <span className="erotic-lang-divider">|</span>}
            <button 
              className={language === lang ? 'active' : ''} 
              onClick={() => changeLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          </span>
        ))}
      </div>

      <motion.div 
        className="erotic-age-gate-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo / Brand */}
        <motion.div 
          className="erotic-age-gate-logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="erotic-logo-icon">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="var(--color-gold)" strokeWidth="1" opacity="0.5"/>
              <path 
                d="M30 10 Q20 20, 25 35 Q30 45, 30 50 Q30 45, 35 35 Q40 20, 30 10" 
                fill="var(--color-crimson)" 
                opacity="0.9"
              />
              <circle cx="30" cy="25" r="3" fill="var(--color-gold)" opacity="0.8"/>
            </svg>
          </div>
          <h1 className="erotic-age-gate-brand">CONFESSION</h1>
          <span className="erotic-age-gate-location">BARCELONA</span>
        </motion.div>

        {/* Divider */}
        <div className="erotic-age-divider">
          <span className="erotic-divider-line" />
          <span className="erotic-divider-diamond">◇</span>
          <span className="erotic-divider-line" />
        </div>

        {/* Warning */}
        <motion.div 
          className="erotic-age-gate-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="erotic-warning-title">{t.ageGate.warning}</p>
          <p className="erotic-warning-text">{t.ageGate.content}</p>
        </motion.div>

        {/* Age confirmation */}
        <motion.div 
          className="erotic-age-confirmation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <label className="erotic-checkbox-wrapper" onClick={() => setIsChecked(!isChecked)}>
            <div className={`erotic-checkbox ${isChecked ? 'checked' : ''}`}>
              {isChecked && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <span className="erotic-checkbox-label">{t.ageGate.question}</span>
          </label>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="erotic-age-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button 
            className={`erotic-btn-enter ${!isChecked ? 'disabled' : ''}`}
            onClick={handleEnter}
            disabled={!isChecked}
          >
            <span>{t.ageGate.enter}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <button className="erotic-btn-exit" onClick={handleExit}>
            {t.ageGate.exit}
          </button>
        </motion.div>

        {/* Legal */}
        <motion.p 
          className="erotic-age-legal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {t.ageGate.legal}
        </motion.p>
      </motion.div>
    </div>
  )
}

export default AgeVerification
