import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './WorkWithUs.css'

const WorkWithUs = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    cv: null
  })
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, cv: file }))
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <section className="work-with-us">
        <div className="work-bg">
          <div className="work-gradient" />
          <div className="work-pattern" />
        </div>
        <motion.div 
          className="success-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>{t.workWithUs?.success?.title || 'Application Received!'}</h2>
          <p>{t.workWithUs?.success?.message || 'Thank you for your interest. We will contact you soon.'}</p>
          <Link 
            to="/" 
            className="btn btn-primary"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            {t.workWithUs?.backToHome || 'Back to Home'}
          </Link>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="work-with-us">
      <div className="work-bg">
        <div className="work-gradient" />
        <div className="work-pattern" />
      </div>

      <div className="work-container">
        <Link 
          to="/" 
          className="back-link"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t.workWithUs?.backToHome || 'Back to Home'}
        </Link>

        <motion.div 
          className="work-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="work-info">
            <div className="work-header">
              <div className="work-logo">
                <span className="logo-main">Confession</span>
                <span className="logo-sub">Barcelona</span>
              </div>
              <h1>{t.workWithUs?.title || 'Join Our Team'}</h1>
              <p className="subtitle">{t.workWithUs?.subtitle || 'Become part of the Confession Barcelona family'}</p>
            </div>

            <p className="intro">{t.workWithUs?.intro || 'Are you a professional massage therapist looking for an exceptional work environment?'}</p>

            <div className="info-section">
              <h3>{t.workWithUs?.offer || 'What We Offer'}</h3>
              <ul>
                {(t.workWithUs?.offerItems || []).map((item, i) => (
                  <li key={i}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>{t.workWithUs?.requirements || 'Requirements'}</h3>
              <ul>
                {(t.workWithUs?.requirementsItems || []).map((item, i) => (
                  <li key={i}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="work-form-container">
            <div className="form-card">
              <h2>{t.workWithUs?.formTitle || 'Apply Now'}</h2>
              <p>{t.workWithUs?.formSubtitle || 'Fill out the form below and attach your CV.'}</p>

              <form onSubmit={handleSubmit} className="work-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t.workWithUs?.form?.name || 'First Name'} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.workWithUs?.form?.namePlaceholder || 'Your first name'}
                      required
                      onFocus={() => setCursorVariant('text')}
                      onBlur={() => setCursorVariant('default')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="surname">{t.workWithUs?.form?.surname || 'Surname'} *</label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder={t.workWithUs?.form?.surnamePlaceholder || 'Your surname'}
                      required
                      onFocus={() => setCursorVariant('text')}
                      onBlur={() => setCursorVariant('default')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t.workWithUs?.form?.phone || 'Phone Number'} *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.workWithUs?.form?.phonePlaceholder || '+34 XXX XXX XXX'}
                    required
                    onFocus={() => setCursorVariant('text')}
                    onBlur={() => setCursorVariant('default')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    {t.workWithUs?.form?.email || 'Email Address'} 
                    <span className="optional">{t.workWithUs?.form?.emailOptional || '(Optional)'}</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.workWithUs?.form?.emailPlaceholder || 'your@email.com'}
                    onFocus={() => setCursorVariant('text')}
                    onBlur={() => setCursorVariant('default')}
                  />
                </div>

                <div className="form-group">
                  <label>{t.workWithUs?.form?.cv || 'Upload CV'} *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="file-button"
                      onClick={() => fileInputRef.current?.click()}
                      onMouseEnter={() => setCursorVariant('hover')}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {t.workWithUs?.form?.cvButton || 'Choose File'}
                    </button>
                    <span className="file-name">
                      {fileName || (t.workWithUs?.form?.cvNoFile || 'No file selected')}
                    </span>
                  </div>
                  <p className="file-note">{t.workWithUs?.form?.cvNote || 'PDF or Word document (with photo recommended)'}</p>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {isLoading ? (
                    <span className="loader-spinner"></span>
                  ) : (
                    t.workWithUs?.form?.submit || 'Submit Application'
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkWithUs

