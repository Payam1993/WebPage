/**
 * Erotic Brand - Services Section
 * Based on Erotic_Project_Sample design
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEroticLanguage } from '../../context/EroticLanguageContext'
import './Services.css'

// Service data for the erotic brand
const servicesData = [
  {
    id: 'surrender-ritual',
    name: { en: 'Surrender Ritual', es: 'Ritual de Entrega', ca: 'Ritual de Lliurament' },
    description: {
      en: 'A powerful introduction to domination massage where control and release intertwine for deep physical and mental surrender.',
      es: 'Una poderosa introducción al masaje de dominación donde el control y la liberación se entrelazan para una profunda entrega física y mental.',
      ca: 'Una poderosa introducció al massatge de dominació on el control i l\'alliberament s\'entrellacen per a un profund lliurament físic i mental.'
    },
    features: { en: ['Sensory control', 'Guided surrender', 'Deep release'], es: ['Control sensorial', 'Entrega guiada', 'Liberación profunda'], ca: ['Control sensorial', 'Lliurament guiat', 'Alliberament profund'] },
    prices: { min30: 120, min60: 200, min90: 280 },
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
  },
  {
    id: 'discipline-devotion',
    name: { en: 'Discipline & Devotion', es: 'Disciplina y Devoción', ca: 'Disciplina i Devoció' },
    description: {
      en: 'An intense session combining firm pressure with commanding presence for those who seek to submit completely.',
      es: 'Una sesión intensa que combina presión firme con presencia imponente para quienes buscan someterse completamente.',
      ca: 'Una sessió intensa que combina pressió ferma amb presència imponent per a qui busquen sotmetre\'s completament.'
    },
    features: { en: ['Firm guidance', 'Boundary exploration', 'Total submission'], es: ['Guía firme', 'Exploración de límites', 'Sumisión total'], ca: ['Guia ferma', 'Exploració de límits', 'Submissió total'] },
    prices: { min30: 150, min60: 250, min90: 350 },
    image: 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=800&q=80'
  },
  {
    id: 'velvet-chains',
    name: { en: 'Velvet Chains', es: 'Cadenas de Terciopelo', ca: 'Cadenes de Vellut' },
    description: {
      en: 'A luxurious experience of restrained pleasure where gentle bondage meets skilled therapeutic touch.',
      es: 'Una experiencia lujosa de placer restringido donde el bondage suave se encuentra con el toque terapéutico experto.',
      ca: 'Una experiència luxosa de plaer restringit on el bondage suau es troba amb el toc terapèutic expert.'
    },
    features: { en: ['Silk restraints', 'Teasing touch', 'Controlled bliss'], es: ['Restricciones de seda', 'Toque provocador', 'Éxtasis controlado'], ca: ['Restriccions de seda', 'Toc provocador', 'Èxtasi controlat'] },
    prices: { min30: 180, min60: 300, min90: 420 },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  },
  {
    id: 'dark-tantra',
    name: { en: 'Dark Tantra', es: 'Tantra Oscuro', ca: 'Tantra Fosc' },
    description: {
      en: 'An erotic fusion of tantric energy work and domination techniques for profound spiritual and physical awakening.',
      es: 'Una fusión erótica de trabajo energético tántrico y técnicas de dominación para un profundo despertar espiritual y físico.',
      ca: 'Una fusió eròtica de treball energètic tàntric i tècniques de dominació per a un profund despertar espiritual i físic.'
    },
    features: { en: ['Energy control', 'Tantric breath', 'Power exchange'], es: ['Control de energía', 'Respiración tántrica', 'Intercambio de poder'], ca: ['Control d\'energia', 'Respiració tàntrica', 'Intercanvi de poder'] },
    prices: { min30: 200, min60: 350, min90: 500 },
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&q=80'
  },
  {
    id: 'the-confession',
    name: { en: 'The Confession', es: 'La Confesión', ca: 'La Confessió' },
    description: {
      en: 'Our signature experience—a journey into your deepest fantasies guided by an experienced dominatrix.',
      es: 'Nuestra experiencia insignia—un viaje a tus fantasías más profundas guiado por una dominatrix experimentada.',
      ca: 'La nostra experiència insígnia—un viatge a les teves fantasies més profundes guiat per una dominatrix experimentada.'
    },
    features: { en: ['Full surrender', 'Fantasy exploration', 'Cathartic release'], es: ['Entrega total', 'Exploración de fantasías', 'Liberación catártica'], ca: ['Lliurament total', 'Exploració de fantasies', 'Alliberament catàrtic'] },
    prices: { min30: 250, min60: 400, min90: 550 },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80'
  },
  {
    id: 'mistress-choice',
    name: { en: "Mistress's Choice", es: 'Elección de la Ama', ca: 'Elecció de l\'Ama' },
    description: {
      en: 'Surrender all control. Your session is entirely at the discretion of your Mistress. Trust completely.',
      es: 'Entrega todo el control. Tu sesión queda enteramente a discreción de tu Ama. Confía completamente.',
      ca: 'Lliura tot el control. La teva sessió queda enterament a discreció de la teva Ama. Confia completament.'
    },
    features: { en: ['Surprise elements', 'Complete trust', 'Unknown pleasures'], es: ['Elementos sorpresa', 'Confianza completa', 'Placeres desconocidos'], ca: ['Elements sorpresa', 'Confiança completa', 'Plaers desconeguts'] },
    prices: { min30: 300, min60: 450, min90: 600 },
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'
  }
]

const ServiceCard = ({ service, index, setCursorVariant, language }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      className="erotic-service-card"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setCursorVariant?.('hover')}
      onMouseLeave={() => setCursorVariant?.('default')}
    >
      <a href="#booking" className="erotic-service-card-link">
        <div className="erotic-service-image erotic-img-zoom">
          <img src={service.image} alt={service.name[language]} loading="lazy" />
          <div className="erotic-service-overlay">
            <div className="erotic-service-prices-preview">
              <span>30' €{service.prices.min30}</span>
              <span>60' €{service.prices.min60}</span>
              <span>90' €{service.prices.min90}</span>
            </div>
          </div>
        </div>
        
        <div className="erotic-service-content">
          <div className="erotic-service-header">
            <h3>{service.name[language]}</h3>
          </div>
          
          <p className="erotic-service-description">{service.description[language]}</p>
          
          <ul className="erotic-service-features">
            {service.features[language].map((feature, i) => (
              <li key={i}>
                <span className="erotic-feature-dot" />
                {feature}
              </li>
            ))}
          </ul>
          
          <span className="erotic-service-link">
            <span>Request Session</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </a>
    </motion.div>
  )
}

const Services = ({ setCursorVariant }) => {
  const { language, t } = useEroticLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })

  return (
    <section id="services" className="erotic-services erotic-section" ref={sectionRef}>
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
              setCursorVariant={setCursorVariant}
              language={language}
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
          <a 
            href="#booking" 
            className="erotic-btn erotic-btn-outline"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {t.services.customBtn}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
