import { useState, useEffect } from 'react'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  PageHeader,
  Input,
  LoadingState,
  EmptyState,
  Icons,
  Grid,
} from '../../components/admin/ui'

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
      <div>
        <PageHeader 
          title="Profile Settings"
          subtitle="Manage your account settings and preferences"
        />
        <Card>
          <LoadingState text="Loading profile..." />
        </Card>
      </div>
    )
  }

  const email = userAttributes?.email || user?.signInDetails?.loginId || user?.username || 'Not available'

  return (
    <div>
      <PageHeader 
        title="Profile Settings"
        subtitle="Manage your account settings and preferences"
      />

      {/* Profile Card */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--ui-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 500,
            flexShrink: 0
          }}>
            {email.charAt(0).toUpperCase()}
          </div>
          
          {/* Info */}
          <div>
            <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ui-text)' }}>
              {email.split('@')[0]}
            </h2>
            <p style={{ margin: 0, color: 'var(--ui-text-muted)', fontSize: '0.875rem' }}>
              {email}
            </p>
            <Badge variant="info" style={{ marginTop: '8px' }}>Staff Member</Badge>
          </div>
        </div>
      </Card>

      <Grid cols={2} gap="large">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle subtitle="Your account details">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                disabled
                hint="Contact your administrator to change your email address"
              />

              <Input
                label="User ID"
                type="text"
                value={user?.userId || 'Not available'}
                disabled
                style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '0.8125rem' }}
              />

              {userAttributes?.email_verified !== undefined && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '6px' }}>
                    Email Status
                  </label>
                  <Badge variant={userAttributes.email_verified === 'true' ? 'success' : 'warning'}>
                    {userAttributes.email_verified === 'true' ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle subtitle="Manage your security settings">
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: 'var(--ui-bg)',
                borderRadius: 'var(--ui-radius)'
              }}>
                <div>
                  <h4 style={{ margin: 0, marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Password</h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
                    Change your password
                  </p>
                </div>
                <Button variant="secondary" size="small" disabled>
                  Change
                </Button>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: 'var(--ui-bg)',
                borderRadius: 'var(--ui-radius)'
              }}>
                <div>
                  <h4 style={{ margin: 0, marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Two-Factor Authentication</h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ui-text-muted)' }}>
                    Extra layer of security
                  </p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Preferences (Placeholder) */}
      <Card style={{ marginTop: '24px' }}>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            }
            title="Coming Soon"
            description="Language, notifications, and display settings will be available here."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSettings
