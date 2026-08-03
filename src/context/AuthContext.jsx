import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { resolveStaffByEmail } from '../services/dataService'

/**
 * Cognito groups:
 * - Admin_Confession → full admin
 * - Mini_Admin → dashboard, costs, pending confirmations
 * - Users → personal dashboard, reservations, calendar
 */

export const ROLES = {
  ADMIN: 'admin',
  MINI_ADMIN: 'miniAdmin',
  USER: 'user',
}

export const GROUP_ADMIN = 'Admin_Confession'
export const GROUP_MINI_ADMIN = 'Mini_Admin'
export const GROUP_USERS = 'Users'

const AuthContext = createContext({
  user: null,
  userEmail: null,
  staffProfile: null,
  groups: [],
  role: ROLES.USER,
  isAuthenticated: false,
  isAdmin: false,
  isMiniAdmin: false,
  isUser: true,
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

export const getGroupsFromSession = async () => {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken
    if (!idToken) return []
    const groups = idToken.payload['cognito:groups'] || []
    return Array.isArray(groups) ? groups : []
  } catch (error) {
    console.error('Error reading Cognito groups:', error)
    return []
  }
}

export const resolveRole = (groups = []) => {
  if (groups.includes(GROUP_ADMIN)) return ROLES.ADMIN
  if (groups.includes(GROUP_MINI_ADMIN)) return ROLES.MINI_ADMIN
  return ROLES.USER
}

/** @deprecated use resolveRole / getGroupsFromSession */
export const checkIsAdmin = async () => {
  const groups = await getGroupsFromSession()
  return groups.includes(GROUP_ADMIN)
}

export const checkUserRole = async () => {
  const groups = await getGroupsFromSession()
  return { groups, role: resolveRole(groups) }
}

const resolveUserEmail = async (currentUser) => {
  try {
    const attributes = await fetchUserAttributes()
    if (attributes?.email) return attributes.email
  } catch {
    // fall through
  }
  return currentUser?.signInDetails?.loginId || currentUser?.username || null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [staffProfile, setStaffProfile] = useState(null)
  const [groups, setGroups] = useState([])
  const [role, setRole] = useState(ROLES.USER)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = () => {
    setUser(null)
    setUserEmail(null)
    setStaffProfile(null)
    setGroups([])
    setRole(ROLES.USER)
  }

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      const nextGroups = await getGroupsFromSession()
      setGroups(nextGroups)
      setRole(resolveRole(nextGroups))

      const email = await resolveUserEmail(currentUser)
      setUserEmail(email)

      const profile = email ? await resolveStaffByEmail(email) : null
      setStaffProfile(profile)
    } catch (error) {
      clearAuth()
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
          clearAuth()
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

  const isAdmin = role === ROLES.ADMIN
  const isMiniAdmin = role === ROLES.MINI_ADMIN
  const isUser = role === ROLES.USER

  const value = {
    user,
    userEmail,
    staffProfile,
    groups,
    role,
    isAuthenticated: !!user,
    isAdmin,
    isMiniAdmin,
    isUser,
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
