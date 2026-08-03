import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { publicAPI } from '../services/dataService'
import './WorkWithUs.css'

const WorkWithUs = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    gender: '',
    yearsOfExperience: '',
    explanation: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await publicAPI.createStaffApplication({
        firstName: formData.name.trim(),
        lastName: formData.surname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        yearsOfExperience: formData.yearsOfExperience,
        explanation: formData.explanation.trim() || null,
      })
      setIsSubmitted(true)
    } catch (err) {
      console.error('Error submitting application:', err)
      setError(
        t.workWithUs?.form?.error ||
          'Something went wrong. Please try again later.'
      )
    } finally {
      setIsLoading(false)
    }
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>{t.workWithUs?.success?.title || 'Thank You!'}</h2>
          <p>
            {t.workWithUs?.success?.message ||
              'Thanks for your interest in working with us. We will get back to you shortly.'}
          </p>
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.workWithUs?.backToHome || 'Back to Home'}
        </Link>

        <motion.div
          className="work-content work-content--form-only"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="work-form-container">
            <div className="form-card">
              <div className="work-logo">
                <span className="logo-main">Confession</span>
                <span className="logo-sub">Barcelona</span>
              </div>
              <h2>{t.workWithUs?.formTitle || 'Work With Us'}</h2>
              <p>
                {t.workWithUs?.formSubtitle ||
                  'Fill out the form below and we will get back to you shortly.'}
              </p>

              <form onSubmit={handleSubmit} className="work-form">
                {error && <div className="form-error">{error}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t.workWithUs?.form?.name || 'Name'} *</label>
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
                    <label htmlFor="surname">{t.workWithUs?.form?.surname || 'Last Name'} *</label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder={t.workWithUs?.form?.surnamePlaceholder || 'Your last name'}
                      required
                      onFocus={() => setCursorVariant('text')}
                      onBlur={() => setCursorVariant('default')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t.workWithUs?.form?.email || 'Email Address'} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.workWithUs?.form?.emailPlaceholder || 'your@email.com'}
                    required
                    onFocus={() => setCursorVariant('text')}
                    onBlur={() => setCursorVariant('default')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t.workWithUs?.form?.phone || 'Contact Number'} *</label>
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender">{t.workWithUs?.form?.gender || 'Gender'} *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      onFocus={() => setCursorVariant('text')}
                      onBlur={() => setCursorVariant('default')}
                    >
                      <option value="">
                        {t.workWithUs?.form?.genderPlaceholder || 'Select gender'}
                      </option>
                      <option value="Man">{t.workWithUs?.form?.genderMan || 'Man'}</option>
                      <option value="Female">{t.workWithUs?.form?.genderFemale || 'Female'}</option>
                      <option value="Others">{t.workWithUs?.form?.genderOthers || 'Others'}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="yearsOfExperience">
                      {t.workWithUs?.form?.experience || 'Years of Experience'} *
                    </label>
                    <select
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      required
                      onFocus={() => setCursorVariant('text')}
                      onBlur={() => setCursorVariant('default')}
                    >
                      <option value="">
                        {t.workWithUs?.form?.experiencePlaceholder || 'Select experience'}
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="5+">
                        {t.workWithUs?.form?.experienceMore || 'More than 5'}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="explanation">
                    {t.workWithUs?.form?.explanation || 'Explanation'}
                    <span className="optional">
                      {t.workWithUs?.form?.optional || '(Optional)'}
                    </span>
                  </label>
                  <textarea
                    id="explanation"
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    placeholder={
                      t.workWithUs?.form?.explanationPlaceholder ||
                      'Tell us a bit about yourself...'
                    }
                    rows={4}
                    onFocus={() => setCursorVariant('text')}
                    onBlur={() => setCursorVariant('default')}
                  />
                </div>

                <button
                  type="submit"
                  className={`submit-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {isLoading ? (
                    <span className="loader-spinner" />
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
