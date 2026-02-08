import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { publicAPI } from '../services/dataService'
import './Booking.css'

const Booking = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })
  
  // Modal state
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    serviceName: '',
    date: '',
    reservedTime: '',
    durationMinutes: 60,
  })

  // Load services when modal opens
  useEffect(() => {
    if (showBookingModal && services.length === 0) {
      loadServices()
    }
  }, [showBookingModal])

  const loadServices = async () => {
    setIsLoadingServices(true)
    setServicesError(null)
    try {
      const data = await publicAPI.getServices()
      setServices(data)
    } catch (err) {
      console.error('Error loading services:', err)
      setServicesError('Unable to load services. Please try again later.')
    } finally {
      setIsLoadingServices(false)
    }
  }

  const handleOpenModal = () => {
    setShowBookingModal(true)
    setSubmitSuccess(false)
    setSubmitError(null)
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    setFormData({
      clientName: '',
      clientPhone: '',
      serviceId: '',
      serviceName: '',
      date: dateStr,
      reservedTime: '',
      durationMinutes: 60,
    })
  }

  const handleCloseModal = () => {
    setShowBookingModal(false)
  }

  const handleServiceSelect = (serviceId) => {
    const service = services.find(s => s.id === serviceId)
    setFormData({
      ...formData,
      serviceId,
      serviceName: service?.serviceName || '',
      durationMinutes: service?.minutes || 60,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Validate required fields
      if (!formData.clientName?.trim()) throw new Error('Name is required')
      if (!formData.clientPhone?.trim()) throw new Error('Phone is required')
      if (!formData.serviceId) throw new Error('Service is required')
      if (!formData.date) throw new Error('Date is required')
      if (!formData.reservedTime) throw new Error('Time is required')
      
      await publicAPI.createBookingRequest({
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        date: formData.date,
        reservedTime: formData.reservedTime,
        durationMinutes: formData.durationMinutes,
      })
      
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
    { value: 75, label: '75 min' },
    { value: 90, label: '90 min' },
    { value: 120, label: '120 min' },
  ]

  // Get translations with fallback
  const bookingFormText = t.booking.bookingForm || {}

  return (
    <section id="booking" className="booking contact-only" ref={sectionRef}>
      <div className="booking-bg">
        <div className="booking-gradient" />
      </div>

      <div className="container">
        <motion.div 
          className="contact-section"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline">{t.booking.overline}</span>
          <h2>{t.booking.title}</h2>
          <p className="booking-description">{t.booking.description}</p>

          <div className="contact-grid">
            <div className="detail-item">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">{t.booking.location}</span>
                <span className="detail-value">Gran Vía de las Corts Catalanes 649<br/>08010 Barcelona</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">{t.booking.phone}</span>
                <span className="detail-value">+34 678 902 765</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">{t.booking.hours}</span>
                <span className="detail-value" style={{ whiteSpace: 'pre-line' }}>{t.booking.hoursValue}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">{t.booking.email}</span>
                <span className="detail-value">confessionbarcelona@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="book-now-container">
            <button
              className="btn btn-primary book-now-btn"
              onClick={handleOpenModal}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {t.booking.bookNow || 'Book Now'}
            </button>
          </div>

          <div className="booking-social">
            <span>{t.booking.followUs}</span>
            <div className="social-links">
              <a href="#" aria-label="Instagram" onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => setCursorVariant('default')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => setCursorVariant('default')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => setCursorVariant('default')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="corner-ornament top-left" />
      <div className="corner-ornament top-right" />

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="booking-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="booking-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {submitSuccess ? (
                <div className="booking-success">
                  <div className="success-icon">✓</div>
                  <h3>{bookingFormText.success || 'Booking Request Sent!'}</h3>
                  <p>{bookingFormText.successMessage || 'Thank you! We\'ll contact you shortly to confirm your appointment.'}</p>
                  <button className="btn btn-primary" onClick={handleCloseModal}>
                    {bookingFormText.close || 'Close'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="modal-header">
                    <h3>{bookingFormText.title || 'Request Booking'}</h3>
                    <p>{bookingFormText.subtitle || 'Fill in your details and we\'ll confirm your appointment'}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="booking-modal-form">
                    {submitError && (
                      <div className="form-error">{submitError}</div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label>{bookingFormText.clientName || 'Your Name'} *</label>
                        <input
                          type="text"
                          placeholder={bookingFormText.clientNamePlaceholder || 'Enter your full name'}
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>{bookingFormText.clientPhone || 'Phone Number'} *</label>
                        <input
                          type="tel"
                          placeholder={bookingFormText.clientPhonePlaceholder || '+34 612 345 678'}
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{bookingFormText.service || 'Service'} *</label>
                      {isLoadingServices ? (
                        <div className="loading-services">Loading services...</div>
                      ) : servicesError ? (
                        <div className="services-error">
                          {servicesError}
                          <button type="button" className="retry-btn" onClick={loadServices}>
                            Retry
                          </button>
                        </div>
                      ) : (
                        <select
                          value={formData.serviceId}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          required
                        >
                          <option value="">{bookingFormText.servicePlaceholder || 'Select a service'}</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.serviceName} {service.minutes ? `(${service.minutes} min)` : ''} {service.fixedPrice ? `- €${service.fixedPrice}` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>{bookingFormText.date || 'Preferred Date'} *</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>{bookingFormText.time || 'Preferred Time'} *</label>
                        <input
                          type="time"
                          value={formData.reservedTime}
                          onChange={(e) => setFormData({ ...formData, reservedTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{bookingFormText.duration || 'Duration'}</label>
                      <select
                        value={formData.durationMinutes}
                        onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      >
                        {durationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCloseModal}
                      >
                        {bookingFormText.cancel || 'Cancel'}
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="loading-spinner"></span>
                        ) : (
                          bookingFormText.submit || 'Request Booking'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Booking
