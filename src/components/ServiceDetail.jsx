import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import { therapistsData } from '../data/therapists'
import './ServiceDetail.css'

// Reservation Modal Component
const ReservationModal = ({ isOpen, onClose, service, serviceText, selectedDuration, setCursorVariant, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    therapist: '',
    service: service?.id || '',
    duration: selectedDuration || '60'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Get available services (excluding corporate)
  const availableServices = servicesData.filter(s => !s.isCorporate)

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
      setFormData({
        name: '',
        surname: '',
        phone: '',
        email: '',
        therapist: '',
        service: service?.id || '',
        duration: selectedDuration || '60'
      })
    }, 300)
  }

  if (!isOpen) return null

  const r = t.reservation || {}

  return (
    <div className="reservation-modal-overlay" onClick={handleClose}>
      <motion.div 
        className="reservation-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose}>×</button>
        
        {isSubmitted ? (
          <div className="reservation-success">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>{r.successTitle || 'Request Received!'}</h3>
            <p>{r.successMessage || 'We will contact you shortly to confirm your booking.'}</p>
            <button 
              className="btn btn-primary"
              onClick={handleClose}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {r.close || 'Close'}
            </button>
          </div>
        ) : (
          <>
            <div className="reservation-modal-header">
              <h3>{r.title || 'Book Your Session'}</h3>
              <p>{r.subtitle || 'Fill in your details to check availability'}</p>
            </div>
            <form onSubmit={handleSubmit} className="reservation-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{r.name || 'Name'} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={r.namePlaceholder || 'Your name'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{r.surname || 'Surname'} *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={e => setFormData({...formData, surname: e.target.value})}
                    placeholder={r.surnamePlaceholder || 'Your surname'}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{r.phone || 'Phone Number'} *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder={r.phonePlaceholder || '+34 XXX XXX XXX'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{r.email || 'Email'} <span className="optional">{r.emailOptional || '(Optional)'}</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder={r.emailPlaceholder || 'your@email.com'}
                  />
                </div>
              </div>

              <div className="form-group therapist-group">
                <label>{r.therapist || 'Preferred Therapist'}</label>
                <select 
                  value={formData.therapist}
                  onChange={e => setFormData({...formData, therapist: e.target.value})}
                >
                  <option value="">{r.noPreference || 'No preference / Random'}</option>
                  {therapistsData.map(therapist => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name}
                    </option>
                  ))}
                </select>
                <Link 
                  to="/our-team" 
                  className="view-therapists-link"
                  onClick={handleClose}
                >
                  {r.viewTherapists || 'View our therapists'} →
                </Link>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{r.service || 'Service'} *</label>
                  <select 
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    required
                  >
                    <option value="">{r.servicePlaceholder || 'Select a service'}</option>
                    {availableServices.map(s => (
                      <option key={s.id} value={s.id}>
                        {serviceTranslations[t.lang || 'en']?.[s.id]?.name || s.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{r.duration || 'Duration'} *</label>
                  <select 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    required
                  >
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {isLoading ? <span className="loader-spinner"></span> : (r.checkAvailability || 'Check Availability')}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

const ServiceDetail = ({ setCursorVariant }) => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [selectedDuration, setSelectedDuration] = useState('60')
  const [showContactForm, setShowContactForm] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const service = servicesData.find(s => s.id === serviceId)
  const t = serviceTranslations[language]
  const serviceText = t[serviceId]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [serviceId])

  if (!service || !serviceText) {
    return (
      <div className="service-not-found">
        <h2>Service not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    )
  }

  const getPrice = () => {
    switch(selectedDuration) {
      case '30': return service.prices.min30
      case '60': return service.prices.min60
      case '90': return service.prices.min90
      default: return service.prices.min60
    }
  }

  const handleReserve = () => {
    setShowReservationModal(true)
  }

  const handleQuestionSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setFormSubmitted(true)
    setTimeout(() => {
      setShowContactForm(false)
      setFormSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 2000)
  }

  return (
    <div className="service-detail">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="service-hero-bg">
          <img src={service.detailImage} alt={serviceText.name} />
          <div className="service-hero-overlay" />
        </div>
        <div className="container">
          <motion.div 
            className="service-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/#services" 
              className="back-link"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {t.backToServices}
            </Link>
            <h1>{serviceText.name}</h1>
            <p className="service-hero-desc">{serviceText.shortDesc}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="service-content-section">
        <div className="container">
          <div className="service-content-grid">
            {/* Left: Description */}
            <motion.div 
              className="service-description"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>{serviceText.name}</h2>
              <div className="long-desc">
                {serviceText.longDesc.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('**') && paragraph.includes('**')) {
                    const title = paragraph.match(/\*\*(.*?)\*\*/)?.[1] || ''
                    const content = paragraph.replace(/\*\*(.*?)\*\*/, '').trim()
                    return (
                      <div key={idx} className="desc-section">
                        <h4>{title}</h4>
                        {content.split('\n').map((line, lineIdx) => (
                          <p key={lineIdx}>{line.replace('• ', '')}</p>
                        ))}
                      </div>
                    )
                  }
                  return <p key={idx}>{paragraph}</p>
                })}
              </div>

              <div className="service-benefits">
                <h3>{t.benefits}</h3>
                <ul>
                  {serviceText.benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <span className="benefit-icon">✓</span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="service-features-tags">
                {serviceText.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </motion.div>

            {/* Right: Booking Card */}
            <motion.div 
              className="service-booking-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="booking-card-inner">
                {service.isCorporate ? (
                  /* Corporate Service - Contact Form */
                  <>
                    <div className="corporate-card-header">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                        <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                      </svg>
                      <h3>{serviceText.name}</h3>
                    </div>
                    <p className="corporate-intro">
                      {serviceText.shortDesc}
                    </p>
                    <div className="corporate-contact-info">
                      <p className="corporate-note">Contact us to discuss your corporate wellness needs and receive a customized proposal.</p>
                    </div>
                    <div className="booking-actions">
                      <button 
                        className="btn btn-primary reserve-btn"
                        onClick={() => setShowContactForm(true)}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {serviceText.contactUs}
                      </button>
                    </div>
                    <div className="contact-quick corporate-contact">
                      <a href="mailto:corporate@confessionbarcelona.com" className="contact-link email-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        corporate@confessionbarcelona.com
                      </a>
                      <a href="tel:+34678902765" className="contact-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        +34 678 902 765
                      </a>
                      <a href="https://wa.me/34678902765" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </>
                ) : (
                  /* Regular Service - Duration & Price Selector */
                  <>
                    <h3>{t.selectDuration}</h3>
                    
                    <div className="duration-options">
                      <button 
                        className={`duration-btn ${selectedDuration === '30' ? 'active' : ''}`}
                        onClick={() => setSelectedDuration('30')}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <span className="duration-time">30 min</span>
                        <span className="duration-price">€{service.prices.min30}</span>
                      </button>
                      <button 
                        className={`duration-btn ${selectedDuration === '60' ? 'active' : ''}`}
                        onClick={() => setSelectedDuration('60')}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <span className="duration-time">60 min</span>
                        <span className="duration-price">€{service.prices.min60}</span>
                      </button>
                      <button 
                        className={`duration-btn ${selectedDuration === '90' ? 'active' : ''}`}
                        onClick={() => setSelectedDuration('90')}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <span className="duration-time">90 min</span>
                        <span className="duration-price">€{service.prices.min90}</span>
                      </button>
                    </div>

                    <p className="consult-note">{t.consultMore}</p>

                    <div className="selected-price">
                      <span className="price-label">{t.price}:</span>
                      <span className="price-value">€{getPrice()}</span>
                    </div>

                    <div className="booking-actions">
                      <button 
                        className="btn btn-primary reserve-btn"
                        onClick={handleReserve}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {t.reserve}
                      </button>
                      <button 
                        className="btn btn-outline question-btn"
                        onClick={() => setShowContactForm(true)}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        {t.askQuestion}
                      </button>
                    </div>

                    <div className="contact-quick">
                      <a href="tel:+34678902765" className="contact-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        +34 678 902 765
                      </a>
                      <a href="https://wa.me/34678902765" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Question Modal */}
      {showContactForm && (
        <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            {formSubmitted ? (
              <div className="form-success-modal">
                <div className="success-icon">✓</div>
                <h3>Thank you!</h3>
                <p>We'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <button className="modal-close" onClick={() => setShowContactForm(false)}>×</button>
                <h3>{t.askQuestion}</h3>
                <p>{serviceText.name}</p>
                <form onSubmit={handleQuestionSubmit}>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                  <textarea 
                    placeholder="Your question..." 
                    rows="4"
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                  <button type="submit" className="btn btn-primary">Send Question</button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Reservation Modal */}
      <AnimatePresence>
        {showReservationModal && (
          <ReservationModal 
            isOpen={showReservationModal}
            onClose={() => setShowReservationModal(false)}
            service={service}
            serviceText={serviceText}
            selectedDuration={selectedDuration}
            setCursorVariant={setCursorVariant}
            t={{...t, lang: language}}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServiceDetail

