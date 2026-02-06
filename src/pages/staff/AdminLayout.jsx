import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut, getCurrentUser } from 'aws-amplify/auth'
import './AdminLayout.css'

/**
 * AdminLayout - Modern dashboard layout for the staff admin area
 * 
 * Features:
 * - Clean, minimal sidebar with navigation
 * - Top header bar with search and user menu
 * - Main content area with max-width container
 * - Responsive design with collapsible sidebar
 */
const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  // Close mobile menu on route change
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
    if (path.includes('/reports')) return 'Dashboard'
    if (path.includes('/costs')) return 'Costs Management'
    if (path.includes('/reservations')) return 'Reservations'
    if (path.includes('/calendar')) return 'Calendar'
    if (path.includes('/profile')) return 'Profile Settings'
    return 'Dashboard'
  }

  const navItems = [
    {
      path: '/staff/reports',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      path: '/staff/costs',
      label: 'Costs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
          <path d="M12 18V6"/>
        </svg>
      ),
    },
    {
      path: '/staff/reservations',
      label: 'Reservations',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="M9 14l2 2 4-4"/>
        </svg>
      ),
    },
    {
      path: '/staff/calendar',
      label: 'Calendar',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ]

  const bottomNavItems = [
    {
      path: '/staff/profile',
      label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
  ]

  const userInitial = user?.signInDetails?.loginId?.charAt(0)?.toUpperCase() || 
                      user?.username?.charAt(0)?.toUpperCase() || 'S'
  const userEmail = user?.signInDetails?.loginId || user?.username || 'Staff Member'

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo area */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-main">Confession</span>
              <span className="logo-sub">Staff Portal</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Menu</span>
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

        {/* Bottom section */}
        <div className="sidebar-footer">
          <ul className="nav-list">
            {bottomNavItems.map((item) => (
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
        {/* Top Header */}
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
            <h1 className="header-title">{getPageTitle()}</h1>
          </div>
          
          <div className="header-right">
            <button 
              className="sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {sidebarCollapsed ? (
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
                ) : (
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                )}
              </svg>
            </button>
            
            <div className="header-user">
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{userEmail.split('@')[0]}</span>
                <span className="user-role">Staff</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
