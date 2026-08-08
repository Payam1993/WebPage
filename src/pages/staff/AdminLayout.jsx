import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut, getCurrentUser } from 'aws-amplify/auth'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { staffT as t } from '../../i18n/staffEs'
import './AdminLayout.css'

const iconDashboard = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const iconCosts = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
  </svg>
)

const iconReservations = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="M9 14l2 2 4-4"/>
  </svg>
)

const iconCalendar = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const iconPending = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const iconStaff = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const iconLink = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

const iconTodo = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin, isMiniAdmin, isUser } = useAuth()
  const { changeLanguage } = useLanguage()
  const [user, setUser] = useState(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  // Staff portal is always Spanish
  useEffect(() => {
    changeLanguage('es')
  }, [changeLanguage])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('admin-mobile-menu-open', mobileMenuOpen)
    return () => document.body.classList.remove('admin-mobile-menu-open')
  }, [mobileMenuOpen])

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
    if (path.includes('/reports')) {
      if (isAdmin) return t.titles.dashboard
      if (isMiniAdmin) return t.titles.miniAdminDashboard
      return t.titles.myDashboard
    }
    if (path.includes('/costs')) return t.titles.costs
    if (path.includes('/reservations')) return isUser ? t.titles.myReservations : t.titles.reservations
    if (path.includes('/calendar')) return isUser ? t.titles.myCalendar : t.titles.calendar
    if (path.includes('/to-do')) return t.titles.toDo
    if (path.includes('/pending-confirmations') || path.includes('/assigned-task')) {
      return t.titles.pendingConfirmations
    }
    if (path.includes('/staff-management')) return t.titles.staff
    if (path.includes('/create-link')) return t.titles.createLink
    if (path.includes('/profile')) return t.titles.profile
    return t.titles.dashboard
  }

  const adminNavItems = [
    { path: '/staff/reports', label: t.nav.dashboard, icon: iconDashboard },
    { path: '/staff/costs', label: t.nav.costs, icon: iconCosts },
    { path: '/staff/reservations', label: t.nav.reservations, icon: iconReservations },
    { path: '/staff/calendar', label: t.nav.calendar, icon: iconCalendar },
    { path: '/staff/to-do', label: t.nav.toDo, icon: iconTodo },
    { path: '/staff/create-link', label: t.nav.createLink, icon: iconLink },
    { path: '/staff/pending-confirmations', label: t.nav.pendingConfirmations, icon: iconPending },
    { path: '/staff/staff-management', label: t.nav.staff, icon: iconStaff },
  ]

  const miniAdminNavItems = [
    { path: '/staff/reports', label: t.nav.dashboard, icon: iconDashboard },
    { path: '/staff/costs', label: t.nav.costs, icon: iconCosts },
    { path: '/staff/calendar', label: t.nav.calendar, icon: iconCalendar },
    { path: '/staff/to-do', label: t.nav.toDo, icon: iconTodo },
    { path: '/staff/pending-confirmations', label: t.nav.pendingConfirmations, icon: iconPending },
  ]

  const userNavItems = [
    { path: '/staff/reports', label: t.nav.dashboard, icon: iconDashboard },
    { path: '/staff/reservations', label: t.nav.reservations, icon: iconReservations },
    { path: '/staff/calendar', label: t.nav.calendar, icon: iconCalendar },
    { path: '/staff/to-do', label: t.nav.toDo, icon: iconTodo },
    { path: '/staff/create-link', label: t.nav.createLink, icon: iconLink },
  ]

  const navItems = isAdmin
    ? adminNavItems
    : isMiniAdmin
      ? miniAdminNavItems
      : userNavItems

  const menuTitle = isAdmin
    ? t.menuAdmin
    : isMiniAdmin
      ? t.menuMiniAdmin
      : t.menuUser

  const roleLabel = isAdmin ? t.roleAdmin : isMiniAdmin ? t.roleMiniAdmin : t.roleUser

  const bottomNavItems = [
    ...(isAdmin
      ? [{
          path: '/administration',
          label: t.administration,
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          ),
          isAdmin: true,
        }]
      : []),
    {
      path: '/staff/profile',
      label: t.settings,
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
  const userEmail = user?.signInDetails?.loginId || user?.username || 'Personal'

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
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
              <span className="logo-main">{t.brand}</span>
              <span className="logo-sub">{t.portal}</span>
            </div>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? t.expandSidebar : t.collapseSidebar}
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
            <span className="nav-section-title">{menuTitle}</span>
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
          <ul className="nav-list">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${item.isAdmin ? 'nav-link--admin' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.isAdmin && <span className="nav-badge">{t.roleAdmin}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          <button onClick={handleSignOut} className="logout-btn" disabled={isSigningOut}>
            {isSigningOut ? (
              <span className="logout-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            )}
            <span className="nav-label">{isSigningOut ? t.signingOut : t.logOut}</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
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
            <div className="header-user">
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{userEmail.split('@')[0]}</span>
                <span className="user-role">{roleLabel}</span>
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

export default AdminLayout
