/**
 * Erotic Brand - Services Section
 * Same structure as original but with dark BDSM theme
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import { useEroticBooking } from '../../context/EroticBookingContext'
import './Services.css'

// Erotic services data
const servicesData = [
  {
    id: 'surrender',
    name: { en: 'Surrender Ritual', es: 'Ritual de Entrega', ca: 'Ritual de Lliurament' },
    description: { 
      en: 'Complete submission experience with expert guidance through levels of control and release.',
      es: 'Experiencia de sumisión completa con guía experta a través de niveles de control y liberación.',
      ca: 'Experiència de submissió completa amb guia experta a través de nivells de control i alliberament.'
    },
    duration: '90 min',
    price: '€280',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80'
  },
  {
    id: 'velvet',
    name: { en: 'Velvet Chains', es: 'Cadenas de Terciopelo', ca: 'Cadenes de Vellut' },
    description: { 
      en: 'Elegant bondage with premium restraints, combining sensory play with artistic rope work.',
      es: 'Bondage elegante con restricciones premium, combinando juego sensorial con trabajo artístico de cuerdas.',
      ca: 'Bondage elegant amb restriccions premium, combinant joc sensorial amb treball artístic de cordes.'
    },
    duration: '75 min',
    price: '€240',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
  },
  {
    id: 'confession',
    name: { en: 'The Confession', es: 'La Confesión', ca: 'La Confessió' },
    description: { 
      en: 'Our signature experience: an intimate journey of revelation, discipline, and cathartic release.',
      es: 'Nuestra experiencia exclusiva: un viaje íntimo de revelación, disciplina y liberación catártica.',
      ca: 'La nostra experiència exclusiva: un viatge íntim de revelació, disciplina i alliberament catàrtic.'
    },
    duration: '120 min',
    price: '€380',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
  },
  {
    id: 'tantra',
    name: { en: 'Dark Tantra', es: 'Tantra Oscuro', ca: 'Tantra Fosc' },
    description: { 
      en: 'Where ancient tantric practices meet the thrill of domination. Spiritual awakening through control.',
      es: 'Donde las prácticas tántricas ancestrales se encuentran con la emoción de la dominación.',
      ca: 'On les pràctiques tàntriques ancestrals es troben amb l\'emoció de la dominació.'
    },
    duration: '90 min',
    price: '€320',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
  }
]

const ServiceCard = ({ service, index, language, openBookingModal }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div 
      ref={cardRef}
      className="erotic-service-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="erotic-service-image">
        <img src={service.image} alt={service.name[language]} />
        <div className="erotic-service-overlay">
          <span className="erotic-service-price">{service.price}</span>
        </div>
      </div>
      
      <div className="erotic-service-content">
        <div className="erotic-service-meta">
          <span>{service.duration}</span>
        </div>
        <h3>{service.name[language]}</h3>
        <p>{service.description[language]}</p>
        <button 
          className="erotic-service-link"
          onClick={() => openBookingModal({ name: service.name[language], id: service.id })}
        >
          Book Session
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

const Services = ({ setCursorVariant }) => {
  const { t, language } = useEroticLanguage()
  const { openBookingModal } = useEroticBooking()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  return (
    <section id="services" className="erotic-section erotic-services" ref={sectionRef}>
      <div className="erotic-container">
        <motion.div 
          className="erotic-section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="erotic-section-overline">{t.services.overline}</span>
          <h2>{t.services.title}</h2>
          <p className="erotic-section-subtitle">{t.services.subtitle}</p>
        </motion.div>

        <div className="erotic-services-grid">
          {servicesData.map((service, index) => (
            <ServiceCard 
              key={service.id}
              service={service}
              index={index}
              language={language}
              openBookingModal={openBookingModal}
            />
          ))}
        </div>

        <motion.div 
          className="erotic-services-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>{t.services.customCta}</p>
          <button 
            className="erotic-btn erotic-btn-outline"
            onClick={() => openBookingModal()}
          >
            {t.services.customBtn}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
