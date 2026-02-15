/**
 * Erotic Brand - Age Verification Component
 * Based on Erotic_Project_Sample design
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './AgeVerification.css'

const AgeVerification = ({ onVerify }) => {
  const { t, language, changeLanguage } = useEroticLanguage()
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
    <div className="erotic-age-gate">
      {/* Animated background elements */}
      <div className="erotic-age-gate-bg">
        <div className="erotic-chain-left" />
        <div className="erotic-chain-right" />
        <motion.div 
          className="erotic-smoke erotic-smoke-1"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="erotic-smoke erotic-smoke-2"
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.3, 1],
            y: [0, -30, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Language selector */}
      <div className="erotic-age-gate-lang">
        <button 
          className={language === 'en' ? 'active' : ''} 
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <span className="erotic-lang-divider">|</span>
        <button 
          className={language === 'es' ? 'active' : ''} 
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
        <span className="erotic-lang-divider">|</span>
        <button 
          className={language === 'ca' ? 'active' : ''} 
          onClick={() => changeLanguage('ca')}
        >
          CA
        </button>
      </div>

      <motion.div 
        className="erotic-age-gate-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative top border */}
        <div className="erotic-gate-border erotic-gate-border-top">
          <span className="erotic-border-ornament">◆</span>
          <span className="erotic-border-line" />
          <span className="erotic-border-ornament">◆</span>
        </div>

        {/* Warning icon - Whip/Latigo design */}
        <motion.div 
          className="erotic-warning-icon"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <svg viewBox="0 0 120 120" className="erotic-whip-icon">
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
          className="erotic-age-gate-title-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="erotic-age-gate-brand">Confession</h1>
          <span className="erotic-age-gate-location">Barcelona</span>
        </motion.div>

        {/* Warning text */}
        <motion.div 
          className="erotic-age-gate-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="erotic-warning-main">{t.ageGate.warning}</p>
          <p className="erotic-warning-sub">{t.ageGate.content}</p>
        </motion.div>

        {/* Age confirmation checkbox */}
        <motion.div 
          className="erotic-age-gate-checkbox-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <label className="erotic-age-checkbox-label">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="erotic-age-checkbox"
            />
            <span className="erotic-checkbox-custom">
              {isChecked && <span className="erotic-checkbox-mark">✓</span>}
            </span>
            <span className="erotic-checkbox-text">{t.ageGate.question}</span>
          </label>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="erotic-age-gate-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button 
            className={`erotic-gate-btn erotic-gate-btn-enter ${!isChecked ? 'disabled' : ''}`} 
            onClick={handleEnter}
            disabled={!isChecked}
          >
            <span className="erotic-btn-icon">⛓</span>
            <span>{t.ageGate.enter}</span>
          </button>
          <button className="erotic-gate-btn erotic-gate-btn-exit" onClick={handleExit}>
            <span>{t.ageGate.exit}</span>
          </button>
        </motion.div>

        {/* Legal disclaimer */}
        <motion.div 
          className="erotic-age-gate-legal-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="erotic-age-gate-legal">{t.ageGate.legal}</p>
        </motion.div>

        {/* Decorative bottom border */}
        <div className="erotic-gate-border erotic-gate-border-bottom">
          <span className="erotic-border-ornament">◆</span>
          <span className="erotic-border-line" />
          <span className="erotic-border-ornament">◆</span>
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="erotic-gate-corner top-left" />
      <div className="erotic-gate-corner top-right" />
      <div className="erotic-gate-corner bottom-left" />
      <div className="erotic-gate-corner bottom-right" />
    </div>
  )
}

export default AgeVerification
