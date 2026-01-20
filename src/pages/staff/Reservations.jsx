import { useState } from 'react'

/**
 * Reservations - Manage client bookings and reservations
 */
const Reservations = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample data - replace with real data from your API
  const reservations = [
    { 
      id: 1, 
      client: 'Maria Garcia', 
      email: 'maria@email.com',
      phone: '+34 612 345 678',
      service: 'Deep Tissue Massage', 
      therapist: 'Luciana',
      date: '2026-01-20',
      time: '10:00',
      duration: '60 min',
      status: 'confirmed',
      notes: 'First visit, mentioned back pain'
    },
    { 
      id: 2, 
      client: 'John Smith', 
      email: 'john@email.com',
      phone: '+34 623 456 789',
      service: 'Swedish Massage', 
      therapist: 'Sadey',
      date: '2026-01-20',
      time: '14:00',
      duration: '90 min',
      status: 'pending',
      notes: ''
    },
    { 
      id: 3, 
      client: 'Anna Johnson', 
      email: 'anna@email.com',
      phone: '+34 634 567 890',
      service: 'Hot Stone Therapy', 
      therapist: 'Luciana',
      date: '2026-01-21',
      time: '11:00',
      duration: '75 min',
      status: 'confirmed',
      notes: 'Regular client, prefers room 2'
    },
    { 
      id: 4, 
      client: 'Carlos Rodriguez', 
      email: 'carlos@email.com',
      phone: '+34 645 678 901',
      service: 'Aromatherapy', 
      therapist: 'Sadey',
      date: '2026-01-21',
      time: '16:00',
      duration: '60 min',
      status: 'confirmed',
      notes: ''
    },
    { 
      id: 5, 
      client: 'Emma Wilson', 
      email: 'emma@email.com',
      phone: '+34 656 789 012',
      service: 'Couples Massage', 
      therapist: 'Luciana & Sadey',
      date: '2026-01-22',
      time: '15:00',
      duration: '90 min',
      status: 'cancelled',
      notes: 'Cancelled due to travel'
    },
  ]

  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus
    const matchesSearch = res.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.service.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reservations</h1>
        <p>Manage and view all client bookings</p>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`admin-btn ${filterStatus === status ? 'primary' : 'secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search by client or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '1px solid rgba(42, 42, 42, 0.12)',
                borderRadius: '8px',
                background: 'var(--color-cream, #f5f0eb)',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Booking List</h2>
          <button className="admin-btn primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            + New Booking
          </button>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No reservations found matching your criteria</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Therapist</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{res.client}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{res.email}</div>
                      </div>
                    </td>
                    <td>{res.service}</td>
                    <td>{res.therapist}</td>
                    <td>
                      <div>
                        <div>{new Date(res.date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{res.time}</div>
                      </div>
                    </td>
                    <td>{res.duration}</td>
                    <td>
                      <span className={`status-badge ${res.status}`}>
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--color-terracotta)', 
                          cursor: 'pointer',
                          padding: '0.25rem',
                          fontSize: '0.85rem'
                        }}>
                          View
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--color-charcoal)', 
                          cursor: 'pointer',
                          padding: '0.25rem',
                          fontSize: '0.85rem',
                          opacity: 0.6
                        }}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations
