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
    id: 'foot-devotion',
    name: { 
      en: 'Foot Devotion Ritual', 
      es: 'Ritual de Devoción a los Pies', 
      ca: 'Ritual de Devoció als Peus' 
    },
    description: { 
      en: 'A focused experience centered on reverence, posture, and controlled proximity. This session blends deliberate touch, ritual pacing, and commanding presence to create a psychologically charged and deeply immersive dynamic.',
      es: 'Una experiencia enfocada centrada en la reverencia, la postura y la proximidad controlada. Esta sesión combina el tacto deliberado, el ritmo ritual y la presencia imponente.',
      ca: 'Una experiència enfocada centrada en la reverència, la postura i la proximitat controlada. Aquesta sessió combina el tacte deliberat, el ritme ritual i la presència imponent.'
    },
    duration: '60 min',
    price: '€180',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80'
  },
  {
    id: 'dominance-ritual',
    name: { 
      en: 'Dominance Ritual Experience', 
      es: 'Experiencia de Ritual de Dominación', 
      ca: 'Experiència de Ritual de Dominació' 
    },
    description: { 
      en: 'A structured power-exchange journey built on authority, anticipation, and controlled intensity. Through firm, intentional techniques and guided relaxation, this session explores tension, surrender, and release within a refined atmosphere.',
      es: 'Un viaje estructurado de intercambio de poder construido sobre la autoridad, la anticipación y la intensidad controlada. A través de técnicas firmes e intencionales.',
      ca: 'Un viatge estructurat d\'intercanvi de poder construït sobre l\'autoritat, l\'anticipació i la intensitat controlada.'
    },
    duration: '90 min',
    price: '€280',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80'
  },
  {
    id: 'sensory-immersion',
    name: { 
      en: 'Erotic Sensory Immersion', 
      es: 'Inmersión Sensorial Erótica', 
      ca: 'Immersió Sensorial Eròtica' 
    },
    description: { 
      en: 'A slow-burning full-body experience designed to heighten awareness and deepen sensation. Flowing movements, rhythmic pressure, and atmospheric presence create an elegant and sensual journey without crossing into explicit territory.',
      es: 'Una experiencia de cuerpo completo diseñada para aumentar la conciencia y profundizar la sensación. Movimientos fluidos, presión rítmica y presencia atmosférica.',
      ca: 'Una experiència de cos complet dissenyada per augmentar la consciència i aprofundir la sensació. Moviments fluids, pressió rítmica i presència atmosfèrica.'
    },
    duration: '75 min',
    price: '€240',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
  },
  {
    id: 'bespoke-power',
    name: { 
      en: 'Bespoke Power Experience', 
      es: 'Experiencia de Poder Personalizada', 
      ca: 'Experiència de Poder Personalitzada' 
    },
    description: { 
      en: 'A fully personalized session tailored to your preferences, intensity level, and desired dynamic. Following a discreet consultation, the experience is crafted uniquely for you — making it the most exclusive and customizable offering.',
      es: 'Una sesión totalmente personalizada adaptada a tus preferencias, nivel de intensidad y dinámica deseada. La experiencia más exclusiva y personalizable.',
      ca: 'Una sessió totalment personalitzada adaptada a les teves preferències, nivell d\'intensitat i dinàmica desitjada. L\'experiència més exclusiva.'
    },
    duration: 'Custom',
    price: 'From €350',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
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
