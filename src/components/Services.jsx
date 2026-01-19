import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './Services.css'

const CorporateModal = ({ isOpen, onClose, serviceText, setCursorVariant, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    company: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', surname: '', phone: '', email: '', company: '' })
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="corporate-modal-overlay" onClick={handleClose}>
      <motion.div 
        className="corporate-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose}>×</button>
        
        {isSubmitted ? (
          <div className="corporate-success">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>{t.corporate?.successTitle || 'Thank You!'}</h3>
            <p>{t.corporate?.successMessage || 'We will get in contact with you as soon as possible.'}</p>
            <button 
              className="btn btn-primary"
              onClick={handleClose}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {t.corporate?.close || 'Close'}
            </button>
          </div>
        ) : (
          <>
            <div className="corporate-modal-header">
              <h3>{serviceText?.name || 'Corporate Wellness'}</h3>
              <p>{t.corporate?.formSubtitle || 'Fill out the form and we will contact you shortly.'}</p>
            </div>
            <form onSubmit={handleSubmit} className="corporate-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t.corporate?.name || 'Name'} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={t.corporate?.namePlaceholder || 'Your name'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.corporate?.surname || 'Surname'} *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={e => setFormData({...formData, surname: e.target.value})}
                    placeholder={t.corporate?.surnamePlaceholder || 'Your surname'}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t.corporate?.phone || 'Phone Number'} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+34 XXX XXX XXX"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t.corporate?.email || 'Email'} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t.corporate?.company || 'Company Name'} *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  placeholder={t.corporate?.companyPlaceholder || 'Your company name'}
                  required
                />
              </div>
              <button 
                type="submit" 
                className={`btn btn-primary submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {isLoading ? <span className="loader-spinner"></span> : (t.corporate?.submit || 'Submit')}
              </button>
            </form>
          </>
        )}
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
