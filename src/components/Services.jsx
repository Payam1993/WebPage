import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './Services.css'

const ContactModal = ({ isOpen, onClose, title, subtitle, message, setCursorVariant, t, variant = 'corporate' }) => {
  const phoneNumber = '+34 691 846 476'
  const whatsappLink = 'https://wa.me/34691846476'
  const isReserve = variant === 'reserveRoom'
  const copy = isReserve ? t.reserveRoom : t.corporate

  if (!isOpen) return null

  return (
    <div className="corporate-modal-overlay" onClick={onClose}>
      <motion.div 
        className="corporate-modal corporate-modal-b2b"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="corporate-b2b-content">
          <div className="b2b-icon">
            {isReserve ? (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18"/>
                <path d="M5 21V7l7-4 7 4v14"/>
                <path d="M9 21v-6h6v6"/>
                <path d="M9 9h.01"/>
                <path d="M15 9h.01"/>
              </svg>
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            )}
          </div>

          <h3 className="b2b-title">{title}</h3>
          
          <p className="b2b-subtitle">
            {subtitle}
          </p>

          <div className="b2b-message">
            <p className="b2b-highlight">
              {message}
            </p>
            {!isReserve && (
              <p>
                {t.corporate?.b2bCta}
              </p>
            )}
          </div>

          <div className="b2b-contact-options">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="b2b-contact-btn whatsapp"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
              <span>{copy?.whatsappBtn || t.corporate?.whatsappBtn || 'WhatsApp'}</span>
            </a>

            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="b2b-contact-btn phone"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>{phoneNumber}</span>
            </a>
          </div>

          <p className="b2b-footer">
            {copy?.footer || copy?.b2bFooter || t.corporate?.b2bFooter}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

const ServiceCard = ({ service, serviceText, index, setCursorVariant, onContactClick }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  const isCorporate = service.isCorporate
  const isReserveRoom = service.isReserveRoom
  const isContactCard = isCorporate || isReserveRoom

  const handleClick = (e) => {
    if (isContactCard) {
      e.preventDefault()
      onContactClick(isReserveRoom ? 'reserveRoom' : 'corporate')
    }
  }

  const badgeLabel = isReserveRoom
    ? (t.reserveRoom?.badge || 'For therapists')
    : (t.corporate?.agreementBased || 'Agreement Based')

  const ctaLabel = isReserveRoom
    ? (t.reserveRoom?.contactUs || serviceText?.contactUs || 'Contact Us')
    : isCorporate
      ? (t.corporate?.contactUs || 'Contact Us')
      : (t.services?.bookThis || 'View Details')

  return (
    <motion.div
      ref={cardRef}
      className={`service-card ${isContactCard ? 'corporate-card' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <Link 
        to={isContactCard ? '#' : `/service/${service.id}`} 
        className="service-card-link"
        onClick={handleClick}
      >
        <div className="service-image img-zoom">
          <img src={service.image} alt={serviceText.name} loading="lazy" />
          <div className="service-overlay">
            <div className="service-prices-preview">
              {isContactCard ? (
                <span className="agreement-badge">{badgeLabel}</span>
              ) : (
                <>
                  <span>30' €{service.prices.min30}</span>
                  <span>60' €{service.prices.min60}</span>
                  <span>90' €{service.prices.min90}</span>
                </>
              )}
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
            <span>{ctaLabel}</span>
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
  const [contactModal, setContactModal] = useState(null) // 'corporate' | 'reserveRoom' | null

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
              onContactClick={(type) => setContactModal(type)}
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

      <AnimatePresence>
        {contactModal === 'corporate' && (
          <ContactModal 
            isOpen
            onClose={() => setContactModal(null)}
            title={serviceTexts['corporate']?.name}
            subtitle={t.corporate?.b2bSubtitle}
            message={t.corporate?.b2bMessage}
            setCursorVariant={setCursorVariant}
            t={t}
            variant="corporate"
          />
        )}
        {contactModal === 'reserveRoom' && (
          <ContactModal 
            isOpen
            onClose={() => setContactModal(null)}
            title={serviceTexts['reserve-room']?.name || t.reserveRoom?.subtitle}
            subtitle={t.reserveRoom?.subtitle}
            message={t.reserveRoom?.message || serviceTexts['reserve-room']?.shortDesc}
            setCursorVariant={setCursorVariant}
            t={t}
            variant="reserveRoom"
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Services
