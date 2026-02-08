import { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import { publicAPI } from '../services/dataService'
import '../components/Booking.css'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const { t } = useLanguage()
  
  // Modal state
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [preselectedService, setPreselectedService] = useState(null)
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

  // Set preselected service when modal opens with a service
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const service = services.find(s => 
        s.serviceName?.toLowerCase() === preselectedService.name?.toLowerCase() ||
        s.id === preselectedService.id
      )
      if (service) {
        setFormData(prev => ({
          ...prev,
          serviceId: service.id,
          serviceName: service.serviceName,
          durationMinutes: service.minutes || 60,
        }))
      }
    }
  }, [preselectedService, services])

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

  const openBookingModal = (serviceInfo = null) => {
    setPreselectedService(serviceInfo)
    setSubmitSuccess(false)
    setSubmitError(null)
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    setFormData({
      clientName: '',
      clientPhone: '',
      serviceId: serviceInfo?.id || '',
      serviceName: serviceInfo?.name || '',
      date: dateStr,
      reservedTime: '',
      durationMinutes: serviceInfo?.duration || 60,
    })
    setShowBookingModal(true)
  }

  const closeBookingModal = () => {
    setShowBookingModal(false)
    setPreselectedService(null)
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
  const bookingFormText = t.booking?.bookingForm || {}

  return (
    <BookingContext.Provider value={{ openBookingModal, closeBookingModal }}>
      {children}
      
      {/* Global Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="booking-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingModal}
          >
            <motion.div
              className="booking-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeBookingModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {submitSuccess ? (
                <div className="booking-success">
                  <div className="success-icon">✓</div>
                  <h3>{bookingFormText.success || 'Booking Request Sent!'}</h3>
                  <p>{bookingFormText.successMessage || 'Thank you! We\'ll contact you shortly to confirm your appointment.'}</p>
                  <button className="btn btn-primary" onClick={closeBookingModal}>
                    {bookingFormText.close || 'Close'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="modal-header">
                    <h3>{bookingFormText.title || 'Request Booking'}</h3>
                    <p>{bookingFormText.subtitle || 'Fill in your details and we\'ll confirm your appointment'}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="modal-contact-info">
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

                  <div className="modal-divider">
                    <span>or fill the form below</span>
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
                        onClick={closeBookingModal}
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
    </BookingContext.Provider>
  )
}

export default BookingContext
