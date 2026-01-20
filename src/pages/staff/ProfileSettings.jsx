import { useState, useEffect } from 'react'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'

/**
 * ProfileSettings - User profile and account settings
 */
const ProfileSettings = () => {
  const [user, setUser] = useState(null)
  const [userAttributes, setUserAttributes] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      try {
        const attributes = await fetchUserAttributes()
        setUserAttributes(attributes)
      } catch (attrError) {
        console.log('Could not fetch user attributes:', attrError)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(42, 42, 42, 0.1)',
            borderTopColor: 'var(--color-terracotta)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      </div>
    )
  }

  const email = userAttributes?.email || user?.signInDetails?.loginId || user?.username || 'Not available'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-terracotta)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 500
          }}>
            {email.charAt(0).toUpperCase()}
          </div>
          
          {/* Info */}
          <div>
            <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{email}</h2>
            <p style={{ margin: 0, opacity: 0.6 }}>Staff Member</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h2>Account Information</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>
              Contact your administrator to change your email address
            </p>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>User ID</label>
            <input 
              type="text" 
              value={user?.userId || 'Not available'}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed', fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
          </div>

          {userAttributes?.email_verified !== undefined && (
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Email Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`status-badge ${userAttributes.email_verified === 'true' ? 'confirmed' : 'pending'}`}>
                  {userAttributes.email_verified === 'true' ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h2>Security</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--color-cream, #f5f0eb)',
            borderRadius: '8px'
          }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1rem' }}>Password</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>
                Change your password to keep your account secure
              </p>
            </div>
            <button 
              className="admin-btn secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              disabled
            >
              Change Password
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--color-cream, #f5f0eb)',
            borderRadius: '8px'
          }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1rem' }}>Two-Factor Authentication</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>
                Add an extra layer of security to your account
              </p>
            </div>
            <button 
              className="admin-btn secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              disabled
            >
              Set Up
            </button>
          </div>
        </div>
      </div>

      {/* Preferences (Placeholder) */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Preferences</h2>
        </div>
        
        <div className="empty-state" style={{ padding: '2rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <p>Additional preferences coming soon</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Language, notifications, and display settings will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
