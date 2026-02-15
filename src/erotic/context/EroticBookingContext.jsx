/**
 * Erotic Brand - Booking Context
 * Reuses existing backend API (publicAPI) with erotic-specific styling
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEroticLanguage } from './EroticLanguageContext'
import { publicAPI } from '../../services/dataService'
import '../styles/booking.css'

const EroticBookingContext = createContext()

export const useEroticBooking = () => {
  const context = useContext(EroticBookingContext)
  if (!context) {
    throw new Error('useEroticBooking must be used within an EroticBookingProvider')
  }
  return context
}

export const EroticBookingProvider = ({ children }) => {
  const { t } = useEroticLanguage()
  
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
      if (!formData.clientName?.trim()) throw new Error(t.booking.errors?.nameRequired || 'Name is required')
      if (!formData.clientPhone?.trim()) throw new Error(t.booking.errors?.phoneRequired || 'Phone is required')
      if (!formData.serviceId) throw new Error(t.booking.errors?.serviceRequired || 'Service is required')
      if (!formData.date) throw new Error(t.booking.errors?.dateRequired || 'Date is required')
      if (!formData.reservedTime) throw new Error(t.booking.errors?.timeRequired || 'Time is required')
      
      // Use the same API as normal brand
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

  return (
    <EroticBookingContext.Provider value={{ openBookingModal, closeBookingModal }}>
      {children}
      
      {/* Global Booking Modal with Erotic Styling */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="erotic-booking-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingModal}
          >
            <motion.div
              className="erotic-booking-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="erotic-booking-close" onClick={closeBookingModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {submitSuccess ? (
                <div className="erotic-booking-success">
                  <div className="erotic-success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                  <h3>{t.booking.success}</h3>
                  <p>{t.booking.successMessage}</p>
                  <button className="erotic-btn-primary" onClick={closeBookingModal}>
                    {t.booking.close}
                  </button>
                </div>
              ) : (
                <>
                  <div className="erotic-booking-header">
                    <span className="erotic-booking-overline">{t.booking.overline}</span>
                    <h3>{t.booking.title}</h3>
                    <p>{t.booking.subtitle}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="erotic-booking-contact">
                    <a href="tel:+34678902765" className="erotic-contact-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                      +34 678 902 765
                    </a>
                    <a href="https://wa.me/34678902765" target="_blank" rel="noopener noreferrer" className="erotic-contact-link whatsapp">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>

                  <div className="erotic-booking-divider">
                    <span>{t.booking.orFillForm}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="erotic-booking-form">
                    {submitError && (
                      <div className="erotic-form-error">{submitError}</div>
                    )}

                    <div className="erotic-form-row">
                      <div className="erotic-form-group">
                        <label>{t.booking.fields.name} *</label>
                        <input
                          type="text"
                          placeholder={t.booking.placeholders.name}
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="erotic-form-group">
                        <label>{t.booking.fields.phone} *</label>
                        <input
                          type="tel"
                          placeholder={t.booking.placeholders.phone}
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="erotic-form-group">
                      <label>{t.booking.fields.service} *</label>
                      {isLoadingServices ? (
                        <div className="erotic-loading-services">Loading services...</div>
                      ) : servicesError ? (
                        <div className="erotic-services-error">
                          {servicesError}
                          <button type="button" className="erotic-retry-btn" onClick={loadServices}>
                            Retry
                          </button>
                        </div>
                      ) : (
                        <select
                          value={formData.serviceId}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          required
                        >
                          <option value="">{t.booking.placeholders.service}</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.serviceName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="erotic-form-row">
                      <div className="erotic-form-group">
                        <label>{t.booking.fields.date} *</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="erotic-form-group">
                        <label>{t.booking.fields.time} *</label>
                        <input
                          type="time"
                          value={formData.reservedTime}
                          onChange={(e) => setFormData({ ...formData, reservedTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="erotic-form-group">
                      <label>{t.booking.fields.duration}</label>
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

                    <div className="erotic-form-actions">
                      <button 
                        type="button" 
                        className="erotic-btn-outline" 
                        onClick={closeBookingModal}
                      >
                        {t.booking.cancel}
                      </button>
                      <button 
                        type="submit" 
                        className="erotic-btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="erotic-loading-spinner"></span>
                        ) : (
                          t.booking.submit
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
    </EroticBookingContext.Provider>
  )
}

export default EroticBookingContext
