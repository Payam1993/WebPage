import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchAuthSession, getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth'
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

/** Per-tab session marker — cleared when the browser tab/window is closed */
const TAB_SESSION_KEY = 'confession_staff_tab_session'

/**
 * Sync-clear Cognito user-pool tokens only.
 * Do NOT wipe amplify-* keys — that breaks public API-key booking (/book-link).
 */
export const clearPersistedAuthTokens = () => {
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key) continue
      if (key.includes('CognitoIdentityServiceProvider')) {
        keys.push(key)
      }
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore storage errors during unload
  }
}

/**
 * Clear Cognito Identity Pool ID cache (guest/auth identity), not User Pool tokens.
 * A stale guest Identity ID + signed-in User Pool session causes:
 * GetCredentialsForIdentity → "Access to Identity '…' is forbidden"
 * which blocks Amplify Storage uploadData/getUrl for authenticated users.
 */
export const clearCognitoIdentityIdCache = () => {
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key) continue
      if (
        key.startsWith('aws.cognito.identity-id.') ||
        key.startsWith('aws.cognito.identity-providers.') ||
        key.includes('CognitoIdentityId')
      ) {
        keys.push(key)
      }
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore
  }
}

/**
 * Ensure Identity Pool AWS credentials match the current User Pool session.
 * Safe to call before Storage uploads; does not log secrets.
 */
export const ensureStorageCredentials = async () => {
  const loadSession = async (forceRefresh = false) => {
    try {
      return await fetchAuthSession(forceRefresh ? { forceRefresh: true } : undefined)
    } catch (error) {
      const message = error?.message || String(error)
      if (/access to identity/i.test(message) || /NotAuthorizedException/i.test(message)) {
        console.warn('[auth] Identity credential fetch forbidden — clearing cached Identity ID', {
          message,
        })
        clearCognitoIdentityIdCache()
        try {
          const { Amplify } = await import('aws-amplify')
          await Amplify.Auth?.clearCredentials?.()
        } catch {
          // optional
        }
        return fetchAuthSession({ forceRefresh: true })
      }
      throw error
    }
  }

  let session = await loadSession(false)
  const hasUserPool = !!(session.tokens?.accessToken && session.tokens?.idToken)
  if (!hasUserPool) {
    throw new Error('No current user')
  }

  if (!(session.credentials?.accessKeyId && session.identityId)) {
    clearCognitoIdentityIdCache()
    try {
      const { Amplify } = await import('aws-amplify')
      await Amplify.Auth?.clearCredentials?.()
    } catch {
      // optional
    }
    session = await loadSession(true)
  }

  if (!(session.credentials?.accessKeyId && session.identityId)) {
    throw new Error(
      'Identity Pool credentials unavailable for Storage. Sign out and sign in again.'
    )
  }

  console.info('[auth] storage credentials ready', {
    hasUserPool: true,
    hasIdentityId: !!session.identityId,
    identityRegion: String(session.identityId || '').split(':')[0] || null,
    groups: session.tokens?.idToken?.payload?.['cognito:groups'] || [],
  })
  return session
}

const markTabSessionActive = () => {
  try {
    sessionStorage.setItem(TAB_SESSION_KEY, '1')
  } catch {
    // ignore
  }
}

const clearTabSession = () => {
  try {
    sessionStorage.removeItem(TAB_SESSION_KEY)
  } catch {
    // ignore
  }
}

const hasTabSession = () => {
  try {
    return sessionStorage.getItem(TAB_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Force logout for Admin / Mini Admin / Users when the browser window/tab was closed.
 * sessionStorage survives refresh but not tab close; Cognito tokens in localStorage would otherwise persist.
 */
const forceLogoutIfTabWasClosed = async () => {
  if (hasTabSession()) return false
  // Public booking links must never trigger staff session cleanup
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/book-link')) {
    return false
  }
  try {
    await getCurrentUser()
    // Tokens still present after a closed tab — wipe Cognito only
    clearPersistedAuthTokens()
    try {
      await signOut({ global: false })
    } catch {
      // already cleared locally
    }
    return true
  } catch {
    // Guest / already signed out — do not touch Amplify storage
    return false
  }
}

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
    clearTabSession()
  }

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      markTabSessionActive()

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
    let cancelled = false

    const boot = async () => {
      await forceLogoutIfTabWasClosed()
      if (!cancelled) {
        await refreshAuth()
      }
    }

    boot()

    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          // Drop any prior guest Identity ID so Storage can federate cleanly
          clearCognitoIdentityIdCache()
          markTabSessionActive()
          refreshAuth()
          break
        case 'signedOut':
          clearCognitoIdentityIdCache()
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
      cancelled = true
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
