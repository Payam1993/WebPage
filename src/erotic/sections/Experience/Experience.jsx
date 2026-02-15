/**
 * Erotic Brand - Experience Section
 * Same structure as original but with dark BDSM theme
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Experience.css'

const Experience = () => {
  const { t } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  return (
    <section id="experience" className="erotic-section erotic-experience" ref={sectionRef}>
      <div className="erotic-container">
        <motion.div 
          className="erotic-section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="erotic-section-overline">{t.experience.overline}</span>
          <h2>{t.experience.title}</h2>
          <p className="erotic-section-subtitle">{t.experience.subtitle}</p>
        </motion.div>

        <div className="erotic-experience-grid">
          {t.experience.features.map((feature, index) => (
            <motion.div
              key={index}
              className="erotic-feature-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="erotic-feature-number">0{index + 1}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="erotic-corner-ornament top-left" />
      <div className="erotic-corner-ornament top-right" />
      <div className="erotic-corner-ornament bottom-left" />
      <div className="erotic-corner-ornament bottom-right" />
    </section>
  )
}

export default Experience
