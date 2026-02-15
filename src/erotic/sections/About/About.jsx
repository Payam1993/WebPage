/**
 * Erotic Brand - About Section
 * Same structure as original but with dark BDSM theme
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './About.css'

const About = () => {
  const { t } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  const stats = [
    { number: "9+", label: t.about.stats.years },
    { number: "2K+", label: t.about.stats.clients },
    { number: "5", label: t.about.stats.therapists },
    { number: "99%", label: t.about.stats.satisfaction }
  ]

  return (
    <section id="about" className="erotic-section erotic-about" ref={sectionRef}>
      <div className="erotic-container">
        <div className="erotic-about-grid">
          <motion.div 
            className="erotic-about-images"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="erotic-about-image main">
              <img 
                src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80" 
                alt="The Dungeon" 
              />
            </div>
            <div className="erotic-about-image secondary">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" 
                alt="Luxury Detail" 
              />
            </div>
          </motion.div>

          <motion.div 
            className="erotic-about-content"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="erotic-section-overline">{t.about.overline}</span>
            <h2>{t.about.title}</h2>
            
            <div className="erotic-about-text">
              <p>{t.about.text1}</p>
              <p>{t.about.text2}</p>
              <p>{t.about.text3}</p>
            </div>

            <div className="erotic-about-signature">
              <div className="erotic-signature-line" />
              <div className="erotic-signature-info">
                <span className="erotic-signature-name">{t.about.founderName}</span>
                <span className="erotic-signature-title">{t.about.founderTitle}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="erotic-about-stats"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="erotic-stat-item">
              <span className="erotic-stat-number">{stat.number}</span>
              <span className="erotic-stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
