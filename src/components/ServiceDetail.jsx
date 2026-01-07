import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { servicesData, serviceTranslations } from '../data/services'
import './ServiceDetail.css'

const ServiceDetail = ({ setCursorVariant }) => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [selectedDuration, setSelectedDuration] = useState('60')
  const [showContactForm, setShowContactForm] = useState(false)
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
    navigate('/#booking')
    setTimeout(() => {
      const bookingSection = document.getElementById('booking')
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
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
    </div>
  )
}

export default ServiceDetail

