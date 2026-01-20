import { useState } from 'react'

/**
 * Reports - Staff reports and analytics page
 */
const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Sample data - replace with real data from your API
  const stats = [
    { label: 'Total Bookings', value: '147', icon: 'booking', color: 'blue' },
    { label: 'Revenue', value: '€12,450', icon: 'revenue', color: 'green' },
    { label: 'New Clients', value: '23', icon: 'clients', color: 'orange' },
    { label: 'Avg. Rating', value: '4.8', icon: 'rating', color: 'purple' },
  ]

  const recentBookings = [
    { id: 1, client: 'Maria Garcia', service: 'Deep Tissue Massage', date: '2026-01-20', status: 'confirmed' },
    { id: 2, client: 'John Smith', service: 'Swedish Massage', date: '2026-01-20', status: 'pending' },
    { id: 3, client: 'Anna Johnson', service: 'Hot Stone Therapy', date: '2026-01-19', status: 'confirmed' },
    { id: 4, client: 'Carlos Rodriguez', service: 'Aromatherapy', date: '2026-01-19', status: 'confirmed' },
    { id: 5, client: 'Emma Wilson', service: 'Couples Massage', date: '2026-01-18', status: 'cancelled' },
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      case 'revenue':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        )
      case 'clients':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        )
      case 'rating':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reports</h1>
        <p>Overview of your business performance and analytics</p>
      </div>

      {/* Period Selector */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['today', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`admin-btn ${selectedPeriod === period ? 'primary' : 'secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              {getIcon(stat.icon)}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Bookings</h2>
          <button className="admin-btn secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            View All
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.client}</td>
                  <td>{booking.service}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
