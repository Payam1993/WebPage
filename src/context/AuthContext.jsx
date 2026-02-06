import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

/**
 * AuthContext - Provides authentication state and admin detection
 * 
 * Reads Cognito groups from ID token to determine if user is admin.
 * Admin group name: "Admin_Confession"
 */

const AuthContext = createContext({
  user: null,
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    try {
      // Get current user
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      // Check admin status
      const adminStatus = await checkIsAdmin()
      setIsAdmin(adminStatus)
    } catch (error) {
      // User is not authenticated
      setUser(null)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial auth check
    refreshAuth()

    // Listen for auth events (sign in, sign out)
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          refreshAuth()
          break
        case 'signedOut':
          setUser(null)
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
