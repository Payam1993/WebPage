import { useState } from 'react'

/**
 * CostsManagement - Manage business costs and expenses
 */
const CostsManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false)

  // Sample data - replace with real data from your API
  const costs = [
    { id: 1, category: 'Supplies', description: 'Massage oils and lotions', amount: 245.50, date: '2026-01-18' },
    { id: 2, category: 'Utilities', description: 'Electricity bill', amount: 189.00, date: '2026-01-15' },
    { id: 3, category: 'Staff', description: 'Training materials', amount: 150.00, date: '2026-01-12' },
    { id: 4, category: 'Maintenance', description: 'Equipment repair', amount: 320.00, date: '2026-01-10' },
    { id: 5, category: 'Marketing', description: 'Social media ads', amount: 200.00, date: '2026-01-08' },
  ]

  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0)

  const costsByCategory = costs.reduce((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.amount
    return acc
  }, {})

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Costs Management</h1>
        <p>Track and manage your business expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              <path d="M12 18V6"/>
            </svg>
          </div>
          <div className="stat-value">€{totalCosts.toFixed(2)}</div>
          <div className="stat-label">Total This Month</div>
        </div>
        {Object.entries(costsByCategory).slice(0, 3).map(([category, amount], index) => (
          <div key={category} className="stat-card">
            <div className={`stat-icon ${['blue', 'green', 'purple'][index]}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3"/>
                <path d="M7 14l4-4 4 4 6-6"/>
              </svg>
            </div>
            <div className="stat-value">€{amount.toFixed(2)}</div>
            <div className="stat-label">{category}</div>
          </div>
        ))}
      </div>

      {/* Costs Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Expense Records</h2>
          <button 
            className="admin-btn primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Add Expense
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div style={{ 
            padding: '1.5rem', 
            marginBottom: '1.5rem', 
            background: 'var(--color-cream, #f5f0eb)', 
            borderRadius: '8px' 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Category</label>
                <select>
                  <option>Supplies</option>
                  <option>Utilities</option>
                  <option>Staff</option>
                  <option>Maintenance</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Description</label>
                <input type="text" placeholder="Enter description" />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Amount (€)</label>
                <input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Date</label>
                <input type="date" />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="admin-btn primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                Save Expense
              </button>
              <button 
                className="admin-btn secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id}>
                  <td>{new Date(cost.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge confirmed`} style={{ background: 'rgba(42, 42, 42, 0.08)', color: 'var(--color-charcoal)' }}>
                      {cost.category}
                    </span>
                  </td>
                  <td>{cost.description}</td>
                  <td style={{ fontWeight: 500 }}>€{cost.amount.toFixed(2)}</td>
                  <td>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--color-terracotta)', 
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}>
                      Edit
                    </button>
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

export default CostsManagement
