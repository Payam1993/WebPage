import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

const About = () => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10])

  const stats = [
    { number: "15+", label: t.about.stats.years },
    { number: "5000+", label: t.about.stats.clients },
    { number: "12", label: t.about.stats.therapists },
    { number: "98%", label: t.about.stats.satisfaction }
  ]

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-bg">
        <motion.div 
          className="about-bg-shape shape-1"
          style={{ y: y1 }}
        />
        <motion.div 
          className="about-bg-shape shape-2"
          style={{ y: y2, rotate }}
        />
      </div>

      <div className="container">
        <div className="about-grid">
          <motion.div 
            className="about-images"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="about-image main-image"
              style={{ y: y1 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=800&q=80" 
                alt="Dungeon atmosphere" 
                loading="lazy"
              />
            </motion.div>
            <motion.div 
              className="about-image secondary-image"
              style={{ y: y2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&q=80" 
                alt="Intimate space" 
                loading="lazy"
              />
            </motion.div>
            <div className="about-image-accent" />
          </motion.div>

          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="section-overline">{t.about.overline}</span>
            <h2>{t.about.title}</h2>
            
            <div className="about-text">
              <p>{t.about.text1}</p>
              <p>{t.about.text2}</p>
              <p>{t.about.text3}</p>
            </div>

            <div className="about-signature">
              <div className="signature-line" />
              <div className="signature-text">
                <span className="signature-name">{t.about.founderName}</span>
                <span className="signature-title">{t.about.founderTitle}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="about-stats"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
