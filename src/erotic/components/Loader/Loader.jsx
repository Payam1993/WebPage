/**
 * Erotic Brand - Loader Component
 * Based on Erotic_Project_Sample design
 */

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './Loader.css'

const Loader = ({ onComplete }) => {
  // Auto-complete after animation duration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, 2500) // Match the longest animation + buffer
    
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="erotic-loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="erotic-loader-content">
        <motion.div 
          className="erotic-loader-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <svg viewBox="0 0 100 100" className="erotic-loader-symbol">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M50 20 C30 35, 30 65, 50 80 C70 65, 70 35, 50 20"
              fill="none"
              stroke="var(--color-crimson)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="5"
              fill="var(--color-gold)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
          </svg>
        </motion.div>
        
        <motion.div 
          className="erotic-loader-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="erotic-loader-title">Confession</span>
          <span className="erotic-loader-subtitle">Barcelona</span>
        </motion.div>
        
        <motion.div 
          className="erotic-loader-progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}

export default Loader
