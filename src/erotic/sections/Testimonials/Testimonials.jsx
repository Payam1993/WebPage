/**
 * Erotic Brand - Testimonials Section
 * Same structure as original but with dark BDSM theme
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    text: {
      en: "An absolutely transformative experience. The session unlocked something I didn't know existed within me. Complete trust, complete surrender.",
      es: "Una experiencia absolutamente transformadora. La sesión desbloqueó algo que no sabía que existía dentro de mí. Confianza completa, entrega completa.",
      ca: "Una experiència absolutament transformadora. La sessió va desbloquejar alguna cosa que no sabia que existia dins meu."
    },
    author: "Anonymous",
    location: "Barcelona"
  },
  {
    id: 2,
    text: {
      en: "I've explored similar spaces across Europe, but nothing compares to this sanctuary. The level of professionalism, discretion, and skill is extraordinary.",
      es: "He explorado espacios similares por toda Europa, pero nada se compara con este santuario. El nivel de profesionalismo es extraordinario.",
      ca: "He explorat espais similars per tot Europa, però res es compara amb aquest santuari."
    },
    author: "Devoted Client",
    location: "London"
  },
  {
    id: 3,
    text: {
      en: "After years of stress and disconnection, I found liberation here. Dark Tantra opened doors to spiritual awakening I never expected.",
      es: "Después de años de estrés y desconexión, encontré la liberación aquí. Tantra Oscuro abrió puertas a un despertar espiritual.",
      ca: "Després d'anys d'estrès i desconnexió, vaig trobar l'alliberament aquí."
    },
    author: "Returning Soul",
    location: "Paris"
  }
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t, language } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="testimonials" className="erotic-section erotic-testimonials" ref={sectionRef}>
      <div className="erotic-container">
        <motion.div 
          className="erotic-section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="erotic-section-overline">{t.testimonials.overline}</span>
          <h2>{t.testimonials.title}</h2>
        </motion.div>

        <motion.div 
          className="erotic-testimonial-carousel"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="erotic-testimonial-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="erotic-quote-icon">"</div>
              <p className="erotic-testimonial-text">
                {testimonials[activeIndex].text[language]}
              </p>
              <div className="erotic-testimonial-author">
                <span className="erotic-author-name">{testimonials[activeIndex].author}</span>
                <span className="erotic-author-location">{testimonials[activeIndex].location}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="erotic-testimonial-nav">
            <button onClick={prev} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="erotic-nav-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`erotic-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
