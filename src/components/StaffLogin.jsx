import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, confirmSignIn, setUpTOTP } from 'aws-amplify/auth'
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
  const [requiresMfa, setRequiresMfa] = useState(false)
  const [requiresMfaSelection, setRequiresMfaSelection] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaType, setMfaType] = useState('')
  const [allowedMfaTypes, setAllowedMfaTypes] = useState([])
  
  // TOTP Setup state
  const [requiresTotpSetup, setRequiresTotpSetup] = useState(false)
  const [totpSetupUri, setTotpSetupUri] = useState('')
  const [totpSecretKey, setTotpSecretKey] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setChallengeNotice('')
    setRequiresNewPassword(false)
    setRequiresMfa(false)
    setRequiresMfaSelection(false)
    setRequiresTotpSetup(false)
    setMfaType('')
    setMfaCode('')
    setAllowedMfaTypes([])
    setTotpSetupUri('')
    setTotpSecretKey('')
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
          case 'SELECT_MFA_TYPE':
            setRequiresMfaSelection(true)
            setAllowedMfaTypes(nextStep.allowedMFATypes || [])
            setChallengeNotice(
              t.staffLogin?.selectMfaNotice ||
                'Select how you want to receive your verification code.'
            )
            setError('')
            break
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
          case 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE':
          case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
            setRequiresMfa(true)
            setMfaType(nextStep.signInStep)
            setChallengeNotice(
              t.staffLogin?.mfaNotice ||
                'Multi-factor authentication is required. Enter the verification code.'
            )
            setError('')
            break
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP': {
            // User needs to set up TOTP (authenticator app) for the first time
            console.log('TOTP Setup Required - nextStep:', nextStep)
            const totpSetupDetails = nextStep.totpSetupDetails
            if (totpSetupDetails) {
              try {
                // Get the setup URI for QR code generation
                const appName = 'Confession Barcelona'
                const setupUri = totpSetupDetails.getSetupUri(appName)
                setTotpSetupUri(setupUri.toString())
                setTotpSecretKey(totpSetupDetails.sharedSecret)
                console.log('TOTP Secret Key:', totpSetupDetails.sharedSecret)
              } catch (uriErr) {
                console.error('Error generating setup URI:', uriErr)
                // Even if URI generation fails, we can still show the secret key
                setTotpSecretKey(totpSetupDetails.sharedSecret || '')
              }
            }
            setRequiresTotpSetup(true)
            setChallengeNotice(
              t.staffLogin?.totpSetupNotice ||
                'Set up your authenticator app to secure your account.'
            )
            setError('')
            break
          }
          default:
            setError(
              t.staffLogin?.additionalStepsRequired ||
                `Additional verification required (${nextStep.signInStep}).`
            )
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
    setRequiresMfa(false)
    setRequiresMfaSelection(false)
    setMfaCode('')

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
    setRequiresMfa(false)
    setRequiresMfaSelection(false)
    setRequiresTotpSetup(false)
    setMfaCode('')
    setMfaType('')
    setAllowedMfaTypes([])
    setTotpSetupUri('')
    setTotpSecretKey('')
  }

  const handleSelectMfaType = async (type) => {
    setError('')
    setChallengeNotice('')
    setIsLoading(true)

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: type,
      })

      if (isSignedIn) {
        navigate('/staff/reports')
      } else if (nextStep) {
        if (
          nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' ||
          nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
          nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' ||
          nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
        ) {
          setRequiresMfa(true)
          setRequiresMfaSelection(false)
          setMfaType(nextStep.signInStep)
          setChallengeNotice(
            t.staffLogin?.mfaNotice ||
              'Multi-factor authentication is required. Enter the verification code.'
          )
        } else {
          setError(
            t.staffLogin?.additionalStepsRequired ||
              `Additional verification required (${nextStep.signInStep}).`
          )
        }
      }
    } catch (err) {
      console.error('MFA selection error:', err)
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMfaSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setChallengeNotice('')

    if (!mfaCode.trim()) {
      setError(t.staffLogin?.mfaCodeRequired || 'Please enter the verification code.')
      return
    }

    setIsLoading(true)

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: mfaCode.trim(),
      })

      if (isSignedIn) {
        navigate('/staff/reports')
      } else if (nextStep) {
        setError(
          t.staffLogin?.additionalStepsRequired ||
            `Additional verification required (${nextStep.signInStep}).`
        )
      }
    } catch (err) {
      console.error('MFA confirm error:', err)
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTotpSetupSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setChallengeNotice('')

    if (!mfaCode.trim()) {
      setError(t.staffLogin?.mfaCodeRequired || 'Please enter the verification code from your authenticator app.')
      return
    }

    setIsLoading(true)

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: mfaCode.trim(),
      })

      if (isSignedIn) {
        navigate('/staff/reports')
      } else if (nextStep) {
        setError(
          t.staffLogin?.additionalStepsRequired ||
            `Additional verification required (${nextStep.signInStep}).`
        )
      }
    } catch (err) {
      console.error('TOTP setup confirm error:', err)
      if (err.name === 'InvalidParameterException' || err.message?.includes('Code mismatch')) {
        setError(t.staffLogin?.invalidCode || 'Invalid verification code. Please try again.')
      } else {
        handleAuthError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // TOTP Setup Form
  if (requiresTotpSetup) {
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
              <h1>{t.staffLogin?.totpSetupTitle || 'Set Up Authenticator'}</h1>
              <p>{t.staffLogin?.totpSetupSubtitle || 'Scan the QR code with your authenticator app'}</p>
            </div>

            <form className="login-form" onSubmit={handleTotpSetupSubmit}>
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

              <div className="totp-setup-container">
                <div className="totp-instructions">
                  <p><strong>Step 1:</strong> {t.staffLogin?.totpStep1 || 'Download an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.'}</p>
                  <p><strong>Step 2:</strong> {t.staffLogin?.totpStep2 || 'Add a new account and enter the secret key below manually.'}</p>
                  <p><strong>Step 3:</strong> {t.staffLogin?.totpStep3 || 'Enter the 6-digit code from your app to verify.'}</p>
                </div>

                {totpSecretKey && (
                  <div className="totp-secret-container">
                    <p className="totp-secret-label">{t.staffLogin?.secretKeyLabel || 'Secret Key (enter this in your authenticator app):'}</p>
                    <code className="totp-secret-key">{totpSecretKey}</code>
                    <p className="totp-secret-hint">{t.staffLogin?.secretKeyHint || 'Account name: Confession Barcelona'}</p>
                  </div>
                )}

                {totpSetupUri && (
                  <div className="totp-qr-container">
                    <p className="totp-qr-label">{t.staffLogin?.qrCodeLabel || 'Or scan this QR code:'}</p>
                    <img 
                      src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(totpSetupUri)}&choe=UTF-8`}
                      alt="TOTP QR Code"
                      className="totp-qr-code"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="totpCode">{t.staffLogin?.totpCodeLabel || 'Verification Code'}</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="totpCode"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder={t.staffLogin?.totpCodePlaceholder || '123456'}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    onFocus={() => setCursorVariant?.('text')}
                    onBlur={() => setCursorVariant?.('default')}
                  />
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
                {t.staffLogin?.verifyAndComplete || 'Verify & Complete Setup'}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    )
  }

  // MFA Selection Form
  if (requiresMfaSelection) {
    const mfaOptions = allowedMfaTypes.length
      ? allowedMfaTypes
      : ['TOTP', 'SMS']

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
              <h1>{t.staffLogin?.mfaSelectTitle || 'Choose Verification Method'}</h1>
              <p>{t.staffLogin?.mfaSelectSubtitle || 'Select how you want to verify your sign-in.'}</p>
            </div>

            <div className="login-form">
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

              <div className="login-options">
                {mfaOptions.includes('TOTP') && (
                  <button
                    type="button"
                    className="login-option-btn"
                    disabled={isLoading}
                    onClick={() => handleSelectMfaType('TOTP')}
                    onMouseEnter={() => setCursorVariant?.('hover')}
                    onMouseLeave={() => setCursorVariant?.('default')}
                  >
                    {t.staffLogin?.mfaTotpOption || 'Authenticator App'}
                  </button>
                )}
                {mfaOptions.includes('SMS') && (
                  <button
                    type="button"
                    className="login-option-btn"
                    disabled={isLoading}
                    onClick={() => handleSelectMfaType('SMS')}
                    onMouseEnter={() => setCursorVariant?.('hover')}
                    onMouseLeave={() => setCursorVariant?.('default')}
                  >
                    {t.staffLogin?.mfaSmsOption || 'SMS Code'}
                  </button>
                )}
                {mfaOptions.includes('EMAIL') && (
                  <button
                    type="button"
                    className="login-option-btn"
                    disabled={isLoading}
                    onClick={() => handleSelectMfaType('EMAIL')}
                    onMouseEnter={() => setCursorVariant?.('hover')}
                    onMouseLeave={() => setCursorVariant?.('default')}
                  >
                    {t.staffLogin?.mfaEmailOption || 'Email Code'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    )
  }

  // MFA Verification Form
  if (requiresMfa) {
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
              <h1>{t.staffLogin?.mfaTitle || 'Verification Required'}</h1>
              <p>
                {mfaType === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
                  ? (t.staffLogin?.mfaTotpSubtitle || 'Enter the code from your authenticator app')
                  : mfaType === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'
                    ? (t.staffLogin?.mfaEmailSubtitle || 'Enter the code sent to your email')
                    : mfaType === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
                      ? (t.staffLogin?.mfaCustomSubtitle || 'Enter the verification code to continue')
                      : (t.staffLogin?.mfaSmsSubtitle || 'Enter the code sent to your phone')}
              </p>
            </div>

            <form className="login-form" onSubmit={handleMfaSubmit}>
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
                <label htmlFor="mfaCode">{t.staffLogin?.mfaCodeLabel || 'Verification Code'}</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1v22"/>
                    <path d="M5 5h14v14H5z"/>
                  </svg>
                  <input
                    type="text"
                    id="mfaCode"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder={t.staffLogin?.mfaCodePlaceholder || '123456'}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    onFocus={() => setCursorVariant?.('text')}
                    onBlur={() => setCursorVariant?.('default')}
                  />
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
                {t.staffLogin?.verifyCode || 'Verify'}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    )
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
