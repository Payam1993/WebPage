/**
 * Erotic Brand - About Section
 * Based on Erotic_Project_Sample design
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './About.css'

const About = () => {
  const { t, language } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  const stats = [
    { number: "9+", label: t.about.stats.years },
    { number: "2K+", label: t.about.stats.clients },
    { number: "5", label: t.about.stats.therapists },
    { number: "99%", label: t.about.stats.satisfaction }
  ]

  return (
    <section id="about" className="erotic-about" ref={sectionRef}>
      <div className="erotic-about-bg">
        <div className="erotic-about-bg-shape shape-1" />
        <div className="erotic-about-bg-shape shape-2" />
      </div>

      <div className="erotic-container">
        <div className="erotic-about-grid">
          <motion.div 
            className="erotic-about-images"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="erotic-about-image main-image">
              <img 
                src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80" 
                alt="Dungeon ambiance" 
              />
            </div>
            <div className="erotic-about-image secondary-image">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" 
                alt="Luxury detail" 
              />
            </div>
            <div className="erotic-about-image-accent" />
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
              <div className="erotic-signature-text">
                <span className="erotic-signature-name">{t.about.founderName}</span>
                <span className="erotic-signature-title">{t.about.founderTitle}</span>
              </div>
            </div>

            <div className="erotic-about-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="erotic-stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <span className="erotic-stat-number">{stat.number}</span>
                  <span className="erotic-stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
