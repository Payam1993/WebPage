/**
 * Cognito Identity Pool helpers (no React / AuthContext imports).
 *
 * Kept separate so Storage code can call these without a circular module graph:
 *   AuthContext → dataService → AuthContext  (breaks Vite chunks as assets/index-*.js)
 */

import { Amplify } from 'aws-amplify'
import { fetchAuthSession } from 'aws-amplify/auth'

/**
 * Clear Cognito Identity Pool ID cache (guest/auth identity), not User Pool tokens.
 * A stale guest Identity ID + signed-in User Pool session causes:
 * GetCredentialsForIdentity → "Access to Identity '…' is forbidden"
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

const clearAmplifyCredentials = async () => {
  try {
    await Amplify.Auth?.clearCredentials?.()
  } catch {
    // optional API
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
        await clearAmplifyCredentials()
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
    await clearAmplifyCredentials()
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
