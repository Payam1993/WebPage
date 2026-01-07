import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: "Isabella García",
    location: "Barcelona",
    rating: 5,
    text: {
      en: "An absolutely transcendent experience. From the moment I walked in, I felt transported to another world. The Mediterranean Ritual was the most relaxing 2 hours of my life.",
      es: "Una experiencia absolutamente trascendente. Desde el momento en que entré, me sentí transportada a otro mundo. El Ritual Mediterráneo fueron las 2 horas más relajantes de mi vida.",
      ca: "Una experiència absolutament transcendent. Des del moment en què vaig entrar, em vaig sentir transportada a un altre món. El Ritual Mediterrani van ser les 2 hores més relaxants de la meva vida."
    },
    service: "Mediterranean Ritual",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
  },
  {
    id: 2,
    name: "Marcus Chen",
    location: "London",
    rating: 5,
    text: {
      en: "I travel frequently for work and have tried massage centers worldwide. Confession Barcelona is in a league of its own. The attention to detail and skill of the therapists is unmatched.",
      es: "Viajo frecuentemente por trabajo y he probado centros de masajes en todo el mundo. Confession Barcelona está en una liga propia. La atención al detalle y la habilidad de los terapeutas es inigualable.",
      ca: "Viatjo freqüentment per feina i he provat centres de massatges arreu del món. Confession Barcelona està en una lliga pròpia. L'atenció al detall i l'habilitat dels terapeutes és inigualable."
    },
    service: "Deep Tissue Revival",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    id: 3,
    name: "Sofia Andersson",
    location: "Stockholm",
    rating: 5,
    text: {
      en: "My partner and I celebrated our anniversary with the Couples Harmony experience. It was intimate, luxurious, and beautifully orchestrated. We left feeling more connected than ever.",
      es: "Mi pareja y yo celebramos nuestro aniversario con la experiencia Armonía en Pareja. Fue íntimo, lujoso y bellamente orquestado. Nos fuimos sintiéndonos más conectados que nunca.",
      ca: "La meva parella i jo vam celebrar el nostre aniversari amb l'experiència Harmonia en Parella. Va ser íntim, luxós i bellament orquestrat. Ens en vam anar sentint-nos més connectats que mai."
    },
    service: "Couples Harmony",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
  },
  {
    id: 4,
    name: "Alessandro Rossi",
    location: "Milan",
    rating: 5,
    text: {
      en: "After years of chronic back pain, I finally found relief. The therapists here truly understand the body. I now visit monthly and recommend Confession to everyone.",
      es: "Después de años de dolor de espalda crónico, finalmente encontré alivio. Los terapeutas aquí realmente entienden el cuerpo. Ahora visito mensualmente y recomiendo Confession a todos.",
      ca: "Després d'anys de dolor d'esquena crònic, finalment vaig trobar alleujament. Els terapeutes aquí realment entenen el cos. Ara visito mensualment i recomano Confession a tothom."
    },
    service: "Signature Confession",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
  }
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t, language } = useLanguage()
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
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline">{t.testimonials.overline}</span>
          <h2>{t.testimonials.title}</h2>
        </motion.div>

        <motion.div 
          className="testimonials-carousel"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="testimonial-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="testimonial-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="testimonial-quote">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                <p className="testimonial-text">{currentTestimonial.text[language]}</p>
                
                <div className="testimonial-service">
                  <span>{t.testimonials.experience}:</span> {currentTestimonial.service}
                </div>
                
                <div className="testimonial-author">
                  <div className="author-image">
                    <img 
                      src={currentTestimonial.image} 
                      alt={currentTestimonial.name} 
                    />
                  </div>
                  <div className="author-info">
                    <span className="author-name">{currentTestimonial.name}</span>
                    <span className="author-location">{currentTestimonial.location}</span>
                  </div>
                  <div className="author-rating">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="testimonial-nav">
            <button 
              className="nav-btn prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <div className="nav-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="nav-btn next"
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
