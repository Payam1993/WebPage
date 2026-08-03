import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { resolveStaffByEmail } from '../services/dataService'

/**
 * AuthContext - Provides authentication state and admin detection
 * 
 * Reads Cognito groups from ID token to determine if user is admin.
 * Admin group name: "Admin_Confession"
 * Resolves linked Staff profile by login email for individual staff views.
 */

const AuthContext = createContext({
  user: null,
  userEmail: null,
  staffProfile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  refreshAuth: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Helper function to check if user is in Admin_Confession group
 */
export const checkIsAdmin = async () => {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken
    
    if (!idToken) {
      return false
    }
    
    // Get groups from the ID token payload
    const groups = idToken.payload['cognito:groups'] || []
    
    // Check if user is in Admin_Confession group
    return Array.isArray(groups) && groups.includes('Admin_Confession')
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

const resolveUserEmail = async (currentUser) => {
  try {
    const attributes = await fetchUserAttributes()
    if (attributes?.email) return attributes.email
  } catch {
    // Attributes may be unavailable; fall through
  }
  return currentUser?.signInDetails?.loginId || currentUser?.username || null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [staffProfile, setStaffProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      const adminStatus = await checkIsAdmin()
      setIsAdmin(adminStatus)

      const email = await resolveUserEmail(currentUser)
      setUserEmail(email)

      const profile = email ? await resolveStaffByEmail(email) : null
      setStaffProfile(profile)
    } catch (error) {
      setUser(null)
      setUserEmail(null)
      setStaffProfile(null)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAuth()

    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          refreshAuth()
          break
        case 'signedOut':
          setUser(null)
          setUserEmail(null)
          setStaffProfile(null)
          setIsAdmin(false)
          break
        case 'tokenRefresh':
          refreshAuth()
          break
        default:
          break
      }
    })

    return () => {
      hubListener()
    }
  }, [refreshAuth])

  const value = {
    user,
    userEmail,
    staffProfile,
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
