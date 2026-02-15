/**
 * Erotic Brand - Hero Component
 * Based on Erotic_Project_Sample design
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Hero.css'

const Hero = ({ setCursorVariant }) => {
  const { t } = useEroticLanguage()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <section className="erotic-hero" ref={heroRef}>
      <div className="erotic-hero-bg">
        <motion.div 
          className="erotic-hero-bg-gradient"
          style={{ y }}
        />
        <div className="erotic-hero-bg-pattern" />
        
        <motion.div 
          className="erotic-floating-element el-1"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="erotic-floating-element el-2"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="erotic-floating-element el-3"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div 
        className="erotic-hero-content"
        style={{ opacity, scale }}
      >
        <div className="erotic-hero-text-container">
          <motion.div 
            className="erotic-hero-overline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="erotic-ornament" />
            <span>{t.hero.overline}</span>
            <span className="erotic-ornament" />
          </motion.div>

          <motion.h1 
            className="erotic-hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            onMouseEnter={() => setCursorVariant?.('text')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            <span className="erotic-title-line">{t.hero.titleLine1}</span>
            <span className="erotic-title-line accent">{t.hero.titleLine2}</span>
          </motion.h1>

          <motion.p 
            className="erotic-hero-description"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t.hero.description}
          </motion.p>

          <motion.div 
            className="erotic-hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a 
              href="#booking" 
              className="erotic-btn erotic-btn-primary"
              onMouseEnter={() => setCursorVariant?.('hover')}
              onMouseLeave={() => setCursorVariant?.('default')}
            >
              {t.hero.cta1}
            </a>
            <a 
              href="#services" 
              className="erotic-btn erotic-btn-outline"
              onMouseEnter={() => setCursorVariant?.('hover')}
              onMouseLeave={() => setCursorVariant?.('default')}
            >
              {t.hero.cta2}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div className="erotic-corner-ornament top-left" />
      <div className="erotic-corner-ornament top-right" />
      <div className="erotic-corner-ornament bottom-left" />
      <div className="erotic-corner-ornament bottom-right" />
    </section>
  )
}

export default Hero
