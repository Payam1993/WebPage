import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'

/**
 * ProtectedRoute - A route guard component that checks authentication status
 * 
 * Usage: Wrap any route that requires authentication
 * - Shows a loading placeholder while checking auth status
 * - Redirects to /staff-login if not authenticated
 * - Renders children if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = checked

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser()
      setIsAuthenticated(true)
    } catch (error) {
      // User is not authenticated
      setIsAuthenticated(false)
    }
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">
          <div className="auth-loading-spinner" />
          <p>Checking authentication...</p>
        </div>
        <style>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-cream, #f5f0eb);
          }
          .auth-loading-content {
            text-align: center;
          }
          .auth-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(42, 42, 42, 0.1);
            border-top-color: var(--color-terracotta, #c4785a);
            border-radius: 50%;
            animation: auth-spin 0.8s linear infinite;
            margin: 0 auto 1rem;
          }
          .auth-loading-content p {
            color: var(--color-charcoal, #2a2a2a);
            font-size: 0.9rem;
            opacity: 0.7;
          }
          @keyframes auth-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/staff-login" replace />
  }

  // Render protected content if authenticated
  return children
}

export default ProtectedRoute
