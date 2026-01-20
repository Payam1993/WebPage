import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, confirmSignIn } from 'aws-amplify/auth'
import { useLanguage } from '../context/LanguageContext'
import './StaffLogin.css'

/**
 * StaffLogin - Custom login form for staff authentication
 * 
 * Uses AWS Amplify Auth signIn with email/password.
 * Handles NEW_PASSWORD_REQUIRED challenge for first-time logins.
 * On success, redirects to /staff/reports (default admin page).
 */
const StaffLogin = ({ setCursorVariant }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // New password challenge state
  const [requiresNewPassword, setRequiresNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [challengeNotice, setChallengeNotice] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      })

      if (isSignedIn) {
        // Successfully signed in, redirect to staff reports (default page)
        navigate('/staff/reports')
      } else if (nextStep) {
        // Handle additional steps
        switch (nextStep.signInStep) {
          case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
            // FORCE_CHANGE_PASSWORD -> prompt for a new password
            setRequiresNewPassword(true)
            setChallengeNotice(
              t.staffLogin?.temporaryPasswordNotice ||
                'This account requires a new password. Please set one to continue.'
            )
            setError('')
            break
          case 'CONFIRM_SIGN_UP':
            setError(t.staffLogin?.confirmSignUp || 'Please confirm your account first.')
            break
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            setError(t.staffLogin?.mfaRequired || 'MFA verification required. Please contact admin.')
            break
          default:
            setError(t.staffLogin?.additionalStepsRequired || 'Additional verification required.')
        }
      }
    } catch (err) {
      console.error('Sign in error:', err)
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setChallengeNotice('')

    // Validate passwords match
    if (newPassword !== confirmNewPassword) {
      setError(t.staffLogin?.passwordsMismatch || 'Passwords do not match.')
      return
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError(t.staffLogin?.passwordTooShort || 'Password must be at least 8 characters.')
      return
    }

    setIsLoading(true)

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword,
      })

      if (isSignedIn) {
        // Successfully set new password and signed in
        navigate('/staff/reports')
      } else if (nextStep) {
        // Handle any additional steps after password change
        setError(t.staffLogin?.additionalStepsRequired || 'Additional verification required.')
      }
    } catch (err) {
      console.error('Confirm sign in error:', err)
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthError = (err) => {
    switch (err.name) {
      case 'NotAuthorizedException':
        setError(t.staffLogin?.invalidCredentials || 'Invalid email or password.')
        break
      case 'UserNotFoundException':
        setError(t.staffLogin?.userNotFound || 'User not found.')
        break
      case 'UserNotConfirmedException':
        setError(t.staffLogin?.userNotConfirmed || 'Account not confirmed. Please contact admin.')
        break
      case 'PasswordResetRequiredException':
        setError(t.staffLogin?.passwordResetRequired || 'Password reset required. Please contact admin.')
        break
      case 'TooManyRequestsException':
        setError(t.staffLogin?.tooManyRequests || 'Too many attempts. Please try again later.')
        break
      case 'InvalidPasswordException':
        setError(t.staffLogin?.invalidPassword || 'Password does not meet requirements. Use at least 8 characters with uppercase, lowercase, numbers, and symbols.')
        break
      case 'LimitExceededException':
        setError(t.staffLogin?.limitExceeded || 'Attempt limit exceeded. Please try again later.')
        break
      default:
        setError(err.message || t.staffLogin?.genericError || 'An error occurred. Please try again.')
    }
  }

  const handleBackToLogin = () => {
    setRequiresNewPassword(false)
    setNewPassword('')
    setConfirmNewPassword('')
    setError('')
    setChallengeNotice('')
  }

  // New Password Form
  if (requiresNewPassword) {
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
          <button 
            onClick={handleBackToLogin}
            className="back-link"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t.staffLogin?.backToLogin || 'Back to Login'}
          </button>

          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <span className="logo-main">Confession</span>
                <span className="logo-sub">Barcelona</span>
              </div>
              <h1>{t.staffLogin?.setNewPassword || 'Set New Password'}</h1>
              <p>{t.staffLogin?.newPasswordSubtitle || 'Please create a new password for your account'}</p>
            </div>

            <form className="login-form" onSubmit={handleNewPasswordSubmit}>
              {challengeNotice && (
                <div className="login-notice">
                  {challengeNotice}
                </div>
              )}
              {error && (
                <div className="login-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="newPassword">{t.staffLogin?.newPassword || 'New Password'}</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    onFocus={() => setCursorVariant?.('text')}
                    onBlur={() => setCursorVariant?.('default')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">{t.staffLogin?.confirmPassword || 'Confirm Password'}</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    onFocus={() => setCursorVariant?.('text')}
                    onBlur={() => setCursorVariant?.('default')}
                  />
                </div>
              </div>

              <div className="password-requirements">
                <p>{t.staffLogin?.passwordRequirements || 'Password must contain:'}</p>
                <ul>
                  <li className={newPassword.length >= 8 ? 'met' : ''}>
                    {t.staffLogin?.req8Chars || 'At least 8 characters'}
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                    {t.staffLogin?.reqUppercase || 'One uppercase letter'}
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'met' : ''}>
                    {t.staffLogin?.reqLowercase || 'One lowercase letter'}
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                    {t.staffLogin?.reqNumber || 'One number'}
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}>
                    {t.staffLogin?.reqSpecial || 'One special character'}
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className={`login-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => setCursorVariant?.('default')}
              >
                {isLoading ? <span className="loader-spinner" /> : null}
                {t.staffLogin?.setPassword || 'Set Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    )
  }

  // Regular Login Form
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
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
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

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t.staffLogin?.email || 'Email'}</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.staffLogin?.emailPlaceholder || 'your@email.com'}
                  required
                  autoComplete="email"
                  onFocus={() => setCursorVariant?.('text')}
                  onBlur={() => setCursorVariant?.('default')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.staffLogin?.password || 'Password'}</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  onFocus={() => setCursorVariant?.('text')}
                  onBlur={() => setCursorVariant?.('default')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              onMouseEnter={() => setCursorVariant?.('hover')}
              onMouseLeave={() => setCursorVariant?.('default')}
            >
              {isLoading ? <span className="loader-spinner" /> : null}
              {t.staffLogin?.signIn || 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>{t.staffLogin?.needHelp || 'Need help?'} <a href="mailto:admin@confessionbarcelona.com">{t.staffLogin?.contactAdmin || 'Contact Admin'}</a></p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default StaffLogin
