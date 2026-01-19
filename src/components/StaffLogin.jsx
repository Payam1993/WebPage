import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './StaffLogin.css'

const StaffLogin = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login - replace with actual authentication
    setTimeout(() => {
      setIsLoading(false)
      // For now, just show an error since there's no backend
      setError(t.staffLogin?.invalidCredentials || 'Invalid credentials. Please try again.')
    }, 1500)
  }

  return (
    <section className="staff-login">
      <div className="staff-login-bg">
        <div className="login-gradient" />
        <div className="login-pattern" />
      </div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link 
          to="/" 
          className="back-link"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t.staffLogin?.backToHome || 'Back to Home'}
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-main">Confession</span>
              <span className="logo-sub">Barcelona</span>
            </div>
            <h1>{t.staffLogin?.title || 'Staff Portal'}</h1>
            <p>{t.staffLogin?.subtitle || 'Sign in to access the staff dashboard'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <motion.div 
                className="login-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t.staffLogin?.email || 'Email'}</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.staffLogin?.emailPlaceholder || 'your@email.com'}
                  required
                  onFocus={() => setCursorVariant('text')}
                  onBlur={() => setCursorVariant('default')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.staffLogin?.password || 'Password'}</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  onFocus={() => setCursorVariant('text')}
                  onBlur={() => setCursorVariant('default')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                {t.staffLogin?.rememberMe || 'Remember me'}
              </label>
              <a 
                href="#forgot" 
                className="forgot-link"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {t.staffLogin?.forgotPassword || 'Forgot password?'}
              </a>
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {isLoading ? (
                <span className="loader-spinner"></span>
              ) : (
                t.staffLogin?.signIn || 'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>{t.staffLogin?.needHelp || 'Need help?'} <a href="mailto:staff@confessionbarcelona.com">{t.staffLogin?.contactAdmin || 'Contact admin'}</a></p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default StaffLogin

