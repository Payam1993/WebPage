import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut, getCurrentUser } from 'aws-amplify/auth'
import './AdministrationLayout.css'

/**
 * AdministrationLayout - Layout for Admin-only area
 * 
 * Has different sidebar options than the regular staff panel:
 * - Reporting
 * - Static Data Registration
 * - Daily Data Registration
 * - Daily Confirmation
 */
const AdministrationLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const fetchUserInfo = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate('/staff')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/reporting')) return 'Reporting'
    if (path.includes('/static-data')) return 'Static Data Registration'
    if (path.includes('/daily-data')) return 'Daily Data Registration'
    if (path.includes('/daily-confirmation')) return 'Daily Confirmation'
    return 'Administration'
  }

  const navItems = [
    {
      path: '/administration/reporting',
      label: 'Reporting',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3"/>
          <path d="M7 14l4-4 4 4 6-6"/>
        </svg>
      ),
    },
    {
      path: '/administration/static-data',
      label: 'Static Data Registration',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      path: '/administration/daily-data',
      label: 'Daily Data Registration',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="9" y1="16" x2="15" y2="16"/>
        </svg>
      ),
    },
    {
      path: '/administration/daily-confirmation',
      label: 'Daily Confirmation',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
  ]

  const userInitial = user?.signInDetails?.loginId?.charAt(0)?.toUpperCase() || 
                      user?.username?.charAt(0)?.toUpperCase() || 'A'
  const userEmail = user?.signInDetails?.loginId || user?.username || 'Admin'

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar admin-sidebar--admin ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon logo-icon--admin">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-main">Administration</span>
              <span className="logo-sub">Admin Portal</span>
            </div>
          </div>
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
              ) : (
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Administration</span>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          {/* Back to Staff Portal link */}
          <NavLink 
            to="/staff/reports"
            className="nav-link back-to-staff"
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            </span>
            <span className="nav-label">Back to Staff Portal</span>
          </NavLink>

          <button 
            onClick={handleSignOut}
            className="logout-btn"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <span className="logout-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            )}
            <span className="nav-label">{isSigningOut ? 'Signing out...' : 'Log out'}</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="header-breadcrumb">
              <span className="breadcrumb-admin">Administration</span>
              <span className="breadcrumb-separator">/</span>
              <h1 className="header-title">{getPageTitle()}</h1>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-user">
              <div className="user-avatar user-avatar--admin">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{userEmail.split('@')[0]}</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdministrationLayout
