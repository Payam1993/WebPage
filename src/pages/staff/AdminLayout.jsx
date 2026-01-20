import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut, getCurrentUser } from 'aws-amplify/auth'
import './AdminLayout.css'

/**
 * AdminLayout - Main layout wrapper for the staff admin area
 * 
 * Features:
 * - Modern left sidebar with navigation
 * - Main content area that changes based on route
 * - Profile settings and logout in sidebar bottom
 */
const AdminLayout = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

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
      navigate('/staff-login')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  const navItems = [
    {
      path: '/staff/reports',
      label: 'Reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3"/>
          <path d="M7 14l4-4 4 4 6-6"/>
        </svg>
      ),
    },
    {
      path: '/staff/costs',
      label: 'Costs Management',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M8 14h.01"/>
          <path d="M12 14h.01"/>
          <path d="M16 14h.01"/>
          <path d="M8 18h.01"/>
          <path d="M12 18h.01"/>
        </svg>
      ),
    },
  ]

  const bottomNavItems = [
    {
      path: '/staff/profile',
      label: 'Profile Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="admin-layout">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo area */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-main">Confession</span>
            <span className="logo-sub">Barcelona</span>
          </div>
          <button 
            className="sidebar-toggle desktop-only"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <path d="M9 18l6-6-6-6"/>
              ) : (
                <path d="M15 18l-6-6 6-6"/>
              )}
            </svg>
          </button>
        </div>

        {/* Main navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="sidebar-footer">
          <ul className="nav-list">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {user?.signInDetails?.loginId?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="user-details">
                <span className="user-email">{user?.signInDetails?.loginId || user?.username || 'Staff'}</span>
                <span className="user-role">Staff Member</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="logout-btn"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <span className="logout-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <main className="admin-main">
        {/* Mobile header */}
        <header className="mobile-header">
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
          <div className="mobile-logo">
            <span className="logo-main">Confession</span>
            <span className="logo-sub">Barcelona</span>
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
