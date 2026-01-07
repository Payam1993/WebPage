import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './Services.css'

const ServiceCard = ({ service, serviceText, index, setCursorVariant }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  const { language } = useLanguage()
  const t = serviceTranslations[language]

  return (
    <motion.div
      ref={cardRef}
      className="service-card"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <Link to={`/service/${service.id}`} className="service-card-link">
        <div className="service-image img-zoom">
          <img src={service.image} alt={serviceText.name} loading="lazy" />
          <div className="service-overlay">
            <div className="service-prices-preview">
              <span>30' €{service.prices.min30}</span>
              <span>60' €{service.prices.min60}</span>
              <span>90' €{service.prices.min90}</span>
            </div>
          </div>
        </div>
        
        <div className="service-content">
          <div className="service-header">
            <h3>{serviceText.name}</h3>
          </div>
          
          <p className="service-description">{serviceText.shortDesc}</p>
          
          <ul className="service-features">
            {serviceText.features.map((feature, i) => (
              <li key={i}>
                <span className="feature-dot" />
                {feature}
              </li>
            ))}
          </ul>
          
          <span className="service-link">
            <span>{t.reserve || 'View Details'}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

const Services = ({ setCursorVariant }) => {
  const { language, t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })
  const serviceTexts = serviceTranslations[language]

  return (
    <section id="services" className="services section" ref={sectionRef}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline">{t.services.overline}</span>
          <h2>{t.services.title}</h2>
          <p className="section-subtitle">{t.services.subtitle}</p>
        </motion.div>

        <div className="services-grid">
          {servicesData.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              serviceText={serviceTexts[service.id]}
              index={index}
              setCursorVariant={setCursorVariant}
            />
          ))}
        </div>

        <motion.div 
          className="services-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>{t.services.customCta}</p>
          <a 
            href="#booking" 
            className="btn btn-outline"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            {t.services.customBtn}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
