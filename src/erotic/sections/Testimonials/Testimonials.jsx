/**
 * Erotic Brand - Testimonials Section
 * Based on Erotic_Project_Sample design
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: "Anonymous",
    location: "Barcelona",
    rating: 5,
    text: {
      en: "An absolutely transformative experience. Mistress Victoria understood my needs before I even expressed them. The Surrender Ritual unlocked something I didn't know existed within me.",
      es: "Una experiencia absolutamente transformadora. La Ama Victoria entendió mis necesidades antes de que las expresara. El Ritual de Entrega desbloqueó algo que no sabía que existía dentro de mí.",
      ca: "Una experiència absolutament transformadora. L'Ama Victoria va entendre les meves necessitats abans que les expressés. El Ritual de Lliurament va desbloquejar alguna cosa que no sabia que existia dins meu."
    },
    service: "Surrender Ritual",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    id: 2,
    name: "Devoted Client",
    location: "London",
    rating: 5,
    text: {
      en: "I've explored similar spaces across Europe, but nothing compares to this sanctuary. The level of professionalism, discretion, and skill is extraordinary. Complete trust, complete surrender.",
      es: "He explorado espacios similares por toda Europa, pero nada se compara con este santuario. El nivel de profesionalismo, discreción y habilidad es extraordinario. Confianza completa, entrega completa.",
      ca: "He explorat espais similars per tot Europa, però res es compara amb aquest santuari. El nivell de professionalisme, discreció i habilitat és extraordinari. Confiança completa, lliurament complet."
    },
    service: "The Confession",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
  },
  {
    id: 3,
    name: "First Timer",
    location: "Berlin",
    rating: 5,
    text: {
      en: "I was nervous about my first experience, but the care and attention I received was beyond anything I imagined. The Velvet Chains session helped me discover a side of myself I never knew.",
      es: "Estaba nervioso por mi primera experiencia, pero el cuidado y la atención que recibí fue más allá de lo que imaginaba. La sesión de Cadenas de Terciopelo me ayudó a descubrir un lado de mí que nunca conocí.",
      ca: "Estava nerviós per la meva primera experiència, però la cura i l'atenció que vaig rebre va ser més enllà del que imaginava. La sessió de Cadenes de Vellut em va ajudar a descobrir un costat de mi que mai vaig conèixer."
    },
    service: "Velvet Chains",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
  },
  {
    id: 4,
    name: "Returning Soul",
    location: "Paris",
    rating: 5,
    text: {
      en: "After years of stress and disconnection, I found liberation here. Dark Tantra opened doors to spiritual awakening I never expected. I return every month—it has become essential to my wellbeing.",
      es: "Después de años de estrés y desconexión, encontré la liberación aquí. Tantra Oscuro abrió puertas a un despertar espiritual que nunca esperé. Regreso cada mes—se ha vuelto esencial para mi bienestar.",
      ca: "Després d'anys d'estrès i desconnexió, vaig trobar l'alliberament aquí. Tantra Fosc va obrir portes a un despertar espiritual que mai vaig esperar. Torno cada mes—s'ha tornat essencial per al meu benestar."
    },
    service: "Dark Tantra",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"
  }
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t, language } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <section id="testimonials" className="erotic-testimonials" ref={sectionRef}>
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
          className="erotic-testimonials-carousel"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="erotic-testimonial-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="erotic-testimonial-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="erotic-testimonial-quote">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                <p className="erotic-testimonial-text">{currentTestimonial.text[language]}</p>
                
                <div className="erotic-testimonial-service">
                  <span>{t.testimonials.experience}:</span> {currentTestimonial.service}
                </div>
                
                <div className="erotic-testimonial-author">
                  <div className="erotic-author-image">
                    <img 
                      src={currentTestimonial.image} 
                      alt={currentTestimonial.name} 
                    />
                  </div>
                  <div className="erotic-author-info">
                    <span className="erotic-author-name">{currentTestimonial.name}</span>
                    <span className="erotic-author-location">{currentTestimonial.location}</span>
                  </div>
                  <div className="erotic-author-rating">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <span key={i} className="erotic-star">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="erotic-testimonial-nav">
            <button 
              className="erotic-nav-btn prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <div className="erotic-nav-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`erotic-nav-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="erotic-nav-btn next"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
