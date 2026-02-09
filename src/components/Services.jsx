import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './Services.css'

const CorporateModal = ({ isOpen, onClose, serviceText, setCursorVariant, t }) => {
  const phoneNumber = '+34 678 902 765'
  const whatsappLink = 'https://wa.me/34678902765'

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
          {/* Icon */}
          <div className="b2b-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          {/* Heading */}
          <h3 className="b2b-title">{serviceText?.name || 'Corporate Wellness'}</h3>
          
          {/* Subtitle */}
          <p className="b2b-subtitle">
            {t.corporate?.b2bSubtitle || 'Business to Business Partnership'}
          </p>

          {/* Main Message */}
          <div className="b2b-message">
            <p>
              {t.corporate?.b2bMessage || 
                'Interested in elevating your team\'s well-being through our premium corporate wellness programs? We\'d love to discuss how we can create a tailored experience for your organization.'}
            </p>
            <p className="b2b-highlight">
              {t.corporate?.b2bCta || 
                'For B2B collaborations and corporate inquiries, please contact us directly — we\'re here to help you design the perfect wellness solution for your company.'}
            </p>
          </div>

          {/* Contact Options */}
          <div className="b2b-contact-options">
            {/* WhatsApp Button */}
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
              <span>{t.corporate?.whatsappBtn || 'Chat on WhatsApp'}</span>
            </a>

            {/* Phone Button */}
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

          {/* Footer Note */}
          <p className="b2b-footer">
            {t.corporate?.b2bFooter || 
              'Our team is available Monday to Saturday, 10:00 - 20:00'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

const ServiceCard = ({ service, serviceText, index, setCursorVariant, onCorporateClick }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  const isCorporate = service.isCorporate

  const handleClick = (e) => {
    if (isCorporate) {
      e.preventDefault()
      onCorporateClick()
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`service-card ${isCorporate ? 'corporate-card' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <Link 
        to={isCorporate ? '#' : `/service/${service.id}`} 
        className="service-card-link"
        onClick={handleClick}
      >
        <div className="service-image img-zoom">
          <img src={service.image} alt={serviceText.name} loading="lazy" />
          <div className="service-overlay">
            <div className="service-prices-preview">
              {isCorporate ? (
                <span className="agreement-badge">{t.corporate?.agreementBased || 'Agreement Based'}</span>
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
            <span>{isCorporate ? (t.corporate?.contactUs || 'Contact Us') : (t.services?.bookThis || 'View Details')}</span>
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
  const [showCorporateModal, setShowCorporateModal] = useState(false)

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
              onCorporateClick={() => setShowCorporateModal(true)}
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
        {showCorporateModal && (
          <CorporateModal 
            isOpen={showCorporateModal}
            onClose={() => setShowCorporateModal(false)}
            serviceText={serviceTexts['corporate']}
            setCursorVariant={setCursorVariant}
            t={t}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Services
