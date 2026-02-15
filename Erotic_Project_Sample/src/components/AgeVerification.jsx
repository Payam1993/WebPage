import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './AgeVerification.css'

const AgeVerification = ({ onVerify }) => {
  const { t, language, changeLanguage } = useLanguage()
  const [isChecked, setIsChecked] = useState(false)

  const handleEnter = () => {
    if (isChecked) {
      localStorage.setItem('ageVerified', 'true')
      localStorage.setItem('ageVerifiedDate', new Date().toISOString())
      onVerify()
    }
  }

  const handleExit = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="age-gate">
      {/* Animated background elements */}
      <div className="age-gate-bg">
        <div className="chain-left" />
        <div className="chain-right" />
        <motion.div 
          className="smoke smoke-1"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="smoke smoke-2"
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.3, 1],
            y: [0, -30, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Language selector */}
      <div className="age-gate-lang">
        <button 
          className={language === 'en' ? 'active' : ''} 
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <span className="lang-divider">|</span>
        <button 
          className={language === 'es' ? 'active' : ''} 
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
        <span className="lang-divider">|</span>
        <button 
          className={language === 'ca' ? 'active' : ''} 
          onClick={() => changeLanguage('ca')}
        >
          CA
        </button>
      </div>

      <motion.div 
        className="age-gate-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative top border */}
        <div className="gate-border gate-border-top">
          <span className="border-ornament">◆</span>
          <span className="border-line" />
          <span className="border-ornament">◆</span>
        </div>

        {/* Warning icon - Whip/Latigo design */}
        <motion.div 
          className="warning-icon"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <svg viewBox="0 0 120 120" className="whip-icon">
            {/* Whip handle */}
            <rect x="54" y="10" width="12" height="35" rx="3" fill="var(--color-gold-dark)" />
            <rect x="52" y="8" width="16" height="8" rx="2" fill="var(--color-gold)" />
            <rect x="52" y="40" width="16" height="8" rx="2" fill="var(--color-gold)" />
            
            {/* Whip lash - curved flowing lines */}
            <path 
              d="M60 48 Q45 60, 55 75 Q65 90, 40 105" 
              stroke="var(--color-crimson)" 
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M60 48 Q70 65, 60 80 Q50 95, 70 110" 
              stroke="var(--color-blood)" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M60 48 Q55 58, 65 70 Q75 82, 85 100" 
              stroke="var(--color-crimson)" 
              strokeWidth="2.5" 
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            
            {/* Whip tips */}
            <circle cx="40" cy="105" r="3" fill="var(--color-crimson)" />
            <circle cx="70" cy="110" r="2.5" fill="var(--color-blood)" />
            <circle cx="85" cy="100" r="2" fill="var(--color-crimson)" opacity="0.8" />
            
            {/* Decorative ring on handle */}
            <circle cx="60" cy="25" r="8" fill="none" stroke="var(--color-crimson)" strokeWidth="1.5" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="age-gate-title-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="age-gate-brand">Confession</h1>
          <span className="age-gate-location">Barcelona</span>
        </motion.div>

        {/* Warning text */}
        <motion.div 
          className="age-gate-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="warning-main">{t.ageGate.warning}</p>
          <p className="warning-sub">{t.ageGate.content}</p>
        </motion.div>

        {/* Age confirmation checkbox */}
        <motion.div 
          className="age-gate-checkbox-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <label className="age-checkbox-label">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="age-checkbox"
            />
            <span className="checkbox-custom">
              {isChecked && <span className="checkbox-mark">✓</span>}
            </span>
            <span className="checkbox-text">{t.ageGate.question}</span>
          </label>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="age-gate-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button 
            className={`gate-btn gate-btn-enter ${!isChecked ? 'disabled' : ''}`} 
            onClick={handleEnter}
            disabled={!isChecked}
          >
            <span className="btn-icon">⛓</span>
            <span>{t.ageGate.enter}</span>
          </button>
          <button className="gate-btn gate-btn-exit" onClick={handleExit}>
            <span>{t.ageGate.exit}</span>
          </button>
        </motion.div>

        {/* Legal disclaimer */}
        <motion.div 
          className="age-gate-legal-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="age-gate-legal">{t.ageGate.legal}</p>
        </motion.div>

        {/* Decorative bottom border */}
        <div className="gate-border gate-border-bottom">
          <span className="border-ornament">◆</span>
          <span className="border-line" />
          <span className="border-ornament">◆</span>
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="gate-corner top-left" />
      <div className="gate-corner top-right" />
      <div className="gate-corner bottom-left" />
      <div className="gate-corner bottom-right" />
    </div>
  )
}

export default AgeVerification
