import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { checkUserRole, ROLES } from '../context/AuthContext'

/**
 * RoleProtectedRoute - allow only specific portal roles
 * @param {string[]} roles - e.g. ['admin', 'miniAdmin']
 */
const RoleProtectedRoute = ({ children, roles = [ROLES.ADMIN] }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    role: ROLES.USER,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      await getCurrentUser()
      const { role } = await checkUserRole()
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        role,
      })
    } catch {
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        role: ROLES.USER,
      })
    }
  }

  if (authState.isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">
          <div className="auth-loading-spinner" />
          <p>Checking authorization...</p>
        </div>
        <style>{`
          .auth-loading {
            min-height: 40vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .auth-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e9ecef;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: auth-spin 0.8s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes auth-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/staff" replace />
  }

  if (!roles.includes(authState.role)) {
    return <Navigate to="/staff/reports" replace />
  }

  return children
}

export default RoleProtectedRoute
