/**
 * Erotic Brand - Loader Component
 * Simple loading screen matching the dark theme
 */

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './Loader.css'

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2000)
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="erotic-loader-brand">Confession</span>
          <span className="erotic-loader-sub">Erotic</span>
        </motion.div>
        
        <motion.div 
          className="erotic-loader-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}

export default Loader
