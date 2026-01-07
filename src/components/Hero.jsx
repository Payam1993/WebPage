import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './Hero.css'

const Hero = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg">
        <motion.div 
          className="hero-bg-gradient"
          style={{ y }}
        />
        <div className="hero-bg-pattern" />
        
        <motion.div 
          className="floating-element el-1"
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
          className="floating-element el-2"
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
          className="floating-element el-3"
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
        className="hero-content"
        style={{ opacity, scale }}
      >
        <div className="hero-text-container">
          <motion.div 
            className="hero-overline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="ornament" />
            <span>{t.hero.overline}</span>
            <span className="ornament" />
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            onMouseEnter={() => setCursorVariant('text')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="title-line">{t.hero.titleLine1}</span>
            <span className="title-line accent">{t.hero.titleLine2}</span>
          </motion.h1>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t.hero.description}
          </motion.p>

          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a 
              href="#booking" 
              className="btn btn-primary"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {t.hero.cta1}
            </a>
            <a 
              href="#services" 
              className="btn btn-outline"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {t.hero.cta2}
            </a>
          </motion.div>
        </div>

        <motion.div 
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span>{t.hero.scroll}</span>
          <motion.div 
            className="scroll-line"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </motion.div>

      <div className="corner-ornament top-left" />
      <div className="corner-ornament top-right" />
      <div className="corner-ornament bottom-left" />
      <div className="corner-ornament bottom-right" />
    </section>
  )
}

export default Hero
