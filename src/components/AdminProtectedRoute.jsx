import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { checkIsAdmin } from '../context/AuthContext'

/**
 * AdminProtectedRoute - Route guard that requires Admin_Confession group membership
 * 
 * Usage: Wrap any route that requires admin access
 * - Shows a loading placeholder while checking auth status
 * - Redirects to /staff if not authenticated
 * - Redirects to /staff/reports with "Not authorized" if authenticated but not admin
 * - Renders children if authenticated AND is admin
 */
const AdminProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  })

  useEffect(() => {
    checkAuthAndAdminStatus()
  }, [])

  const checkAuthAndAdminStatus = async () => {
    try {
      // First check if user is authenticated
      await getCurrentUser()
      
      // Then check if user is admin
      const adminStatus = await checkIsAdmin()
      
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        isAdmin: adminStatus,
      })
    } catch (error) {
      // User is not authenticated
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
      })
    }
  }

  // Show loading while checking authentication
  if (authState.isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">
          <div className="auth-loading-spinner" />
          <p>Checking authorization...</p>
        </div>
        <style>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
          }
          .auth-loading-content {
            text-align: center;
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
          .auth-loading-content p {
            color: #1a1a2e;
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
  if (!authState.isAuthenticated) {
    return <Navigate to="/staff" replace />
  }

  // Redirect to staff dashboard if authenticated but not admin
  if (!authState.isAdmin) {
    return (
      <div className="not-authorized">
        <div className="not-authorized-content">
          <div className="not-authorized-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this area.</p>
          <a href="/staff/reports" className="back-link">
            Return to Staff Dashboard
          </a>
        </div>
        <style>{`
          .not-authorized {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .not-authorized-content {
            text-align: center;
            padding: 2rem;
          }
          .not-authorized-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #fef2f2;
            color: #ef4444;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
          .not-authorized h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a1a2e;
            margin: 0 0 0.5rem 0;
          }
          .not-authorized p {
            color: #6c757d;
            margin: 0 0 1.5rem 0;
          }
          .back-link {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.875rem;
            transition: background 0.2s;
          }
          .back-link:hover {
            background: #1d4ed8;
          }
        `}</style>
      </div>
    )
  }

  // Render protected content if authenticated AND admin
  return children
}

export default AdminProtectedRoute
