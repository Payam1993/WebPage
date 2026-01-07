import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './Experience.css'

const featureIcons = [
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="32" cy="32" r="28" />
    <path d="M32 16v16l12 8" />
  </svg>,
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M32 8c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z" />
    <path d="M32 20c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" />
    <circle cx="32" cy="32" r="4" />
  </svg>,
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M32 8L8 24v16l24 16 24-16V24L32 8z" />
    <path d="M8 24l24 16 24-16" />
    <path d="M32 40v16" />
  </svg>,
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M32 56c13.255 0 24-10.745 24-24S45.255 8 32 8 8 18.745 8 32s10.745 24 24 24z" />
    <path d="M24 24c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" />
    <path d="M32 40v8" />
    <circle cx="32" cy="52" r="2" />
  </svg>
]

const Experience = () => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  return (
    <section id="experience" className="experience" ref={sectionRef}>
      <div className="experience-bg">
        <div className="experience-pattern" />
      </div>

      <div className="container">
        <motion.div 
          className="experience-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline light">{t.experience.overline}</span>
          <h2>{t.experience.title}</h2>
          <p className="section-subtitle">{t.experience.subtitle}</p>
        </motion.div>

        <div className="experience-features">
          {t.experience.features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="feature-icon">
                {featureIcons[index]}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="experience-amenities"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3>{t.experience.amenitiesTitle}</h3>
          <div className="amenities-list">
            {t.experience.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                <span className="amenity-check">✓</span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="corner-ornament top-left" />
      <div className="corner-ornament top-right" />
      <div className="corner-ornament bottom-left" />
      <div className="corner-ornament bottom-right" />
    </section>
  )
}

export default Experience
