/**
 * Admin UI Components
 * A clean, modern design system for the admin dashboard
 */

import './styles.css'

// ============================================
// Card Components
// ============================================
export const Card = ({ children, className = '', padding = true, ...props }) => (
  <div className={`ui-card ${padding ? '' : 'no-padding'} ${className}`} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = '', actions, ...props }) => (
  <div className={`ui-card-header ${className}`} {...props}>
    <div className="ui-card-header-content">{children}</div>
    {actions && <div className="ui-card-header-actions">{actions}</div>}
  </div>
)

export const CardTitle = ({ children, className = '', subtitle, ...props }) => (
  <div className={`ui-card-title-wrapper ${className}`} {...props}>
    <h3 className="ui-card-title">{children}</h3>
    {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
  </div>
)

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`ui-card-content ${className}`} {...props}>
    {children}
  </div>
)

// ============================================
// Button Component
// ============================================
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => (
  <button 
    className={`ui-btn ui-btn-${variant} ui-btn-${size} ${loading ? 'loading' : ''} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <span className="ui-btn-spinner" />}
    {icon && iconPosition === 'left' && !loading && <span className="ui-btn-icon">{icon}</span>}
    <span className="ui-btn-text">{children}</span>
    {icon && iconPosition === 'right' && !loading && <span className="ui-btn-icon">{icon}</span>}
  </button>
)

// ============================================
// Input Component
// ============================================
export const Input = ({ 
  label, 
  error, 
  hint,
  className = '', 
  containerClassName = '',
  style,
  ...props 
}) => (
  <div className={`ui-form-group ${error ? 'has-error' : ''} ${containerClassName}`}>
    {label && <label className="ui-label">{label}</label>}
    <input className={`ui-input ${className}`} style={style} {...props} />
    {hint && !error && <span className="ui-hint">{hint}</span>}
    {error && <span className="ui-error">{error}</span>}
  </div>
)

// ============================================
// Select Component
// ============================================
export const Select = ({ 
  label, 
  error,
  hint,
  options = [],
  placeholder,
  className = '', 
  containerClassName = '',
  ...props 
}) => (
  <div className={`ui-form-group ${error ? 'has-error' : ''} ${containerClassName}`}>
    {label && <label className="ui-label">{label}</label>}
    <select className={`ui-select ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {hint && !error && <span className="ui-hint">{hint}</span>}
    {error && <span className="ui-error">{error}</span>}
  </div>
)

// ============================================
// Badge Component
// ============================================
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'default',
  className = '', 
  ...props 
}) => (
  <span className={`ui-badge ui-badge-${variant} ui-badge-${size} ${className}`} {...props}>
    {children}
  </span>
)

// ============================================
// Table Components
// ============================================
export const Table = ({ children, className = '', ...props }) => (
  <div className="ui-table-wrapper">
    <table className={`ui-table ${className}`} {...props}>
      {children}
    </table>
  </div>
)

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`ui-table-header ${className}`} {...props}>
    {children}
  </thead>
)

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`ui-table-body ${className}`} {...props}>
    {children}
  </tbody>
)

export const TableRow = ({ children, className = '', clickable = false, ...props }) => (
  <tr className={`ui-table-row ${clickable ? 'clickable' : ''} ${className}`} {...props}>
    {children}
  </tr>
)

export const TableHead = ({ children, className = '', ...props }) => (
  <th className={`ui-table-head ${className}`} {...props}>
    {children}
  </th>
)

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`ui-table-cell ${className}`} {...props}>
    {children}
  </td>
)

// ============================================
// Stat Card Component
// ============================================
export const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon,
  trend,
  trendDirection = 'up',
  className = '', 
  ...props 
}) => (
  <div className={`ui-stat-card ${className}`} {...props}>
    {icon && <div className="ui-stat-icon">{icon}</div>}
    <div className="ui-stat-content">
      <span className="ui-stat-value">{value}</span>
      <span className="ui-stat-title">{title}</span>
      {(subtitle || trend) && (
        <div className="ui-stat-meta">
          {trend && (
            <span className={`ui-stat-trend ui-stat-trend-${trendDirection}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span className="ui-stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  </div>
)

// ============================================
// Empty State Component
// ============================================
export const EmptyState = ({ 
  icon,
  title = 'No data found',
  description,
  action,
  className = '', 
  ...props 
}) => (
  <div className={`ui-empty-state ${className}`} {...props}>
    {icon && <div className="ui-empty-icon">{icon}</div>}
    <h4 className="ui-empty-title">{title}</h4>
    {description && <p className="ui-empty-description">{description}</p>}
    {action && <div className="ui-empty-action">{action}</div>}
  </div>
)

// ============================================
// Loading State Component
// ============================================
export const LoadingState = ({ 
  text = 'Loading...',
  className = '', 
  ...props 
}) => (
  <div className={`ui-loading-state ${className}`} {...props}>
    <div className="ui-loading-spinner" />
    <span className="ui-loading-text">{text}</span>
  </div>
)

// ============================================
// Divider Component
// ============================================
export const Divider = ({ className = '', ...props }) => (
  <hr className={`ui-divider ${className}`} {...props} />
)

// ============================================
// Page Header Component
// ============================================
export const PageHeader = ({ 
  title, 
  subtitle,
  actions,
  className = '', 
  ...props 
}) => (
  <div className={`ui-page-header ${className}`} {...props}>
    <div className="ui-page-header-content">
      <h1 className="ui-page-title">{title}</h1>
      {subtitle && <p className="ui-page-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="ui-page-actions">{actions}</div>}
  </div>
)

// ============================================
// Grid Components
// ============================================
export const Grid = ({ children, cols = 4, gap = 'default', className = '', ...props }) => (
  <div 
    className={`ui-grid ui-grid-cols-${cols} ui-grid-gap-${gap} ${className}`} 
    {...props}
  >
    {children}
  </div>
)

// ============================================
// Icon Components (commonly used icons)
// ============================================
// ============================================
// Modal Component
// ============================================
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  size = 'default',
  className = '' 
}) => {
  if (!isOpen) return null

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div 
        className={`ui-modal ui-modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-modal-header">
          <div className="ui-modal-title-wrapper">
            <h2 className="ui-modal-title">{title}</h2>
            {subtitle && <p className="ui-modal-subtitle">{subtitle}</p>}
          </div>
          <button className="ui-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="ui-modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Confirm Dialog Component
// ============================================
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div 
        className="ui-modal ui-modal-small ui-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-confirm-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 className="ui-confirm-title">{title}</h3>
        <p className="ui-confirm-message">{message}</p>
        <div className="ui-confirm-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Clickable Card Component (for navigation/selection)
// ============================================
export const ClickableCard = ({
  title,
  subtitle,
  icon,
  onClick,
  className = '',
  ...props
}) => (
  <button 
    className={`ui-clickable-card ${className}`}
    onClick={onClick}
    {...props}
  >
    {icon && <div className="ui-clickable-card-icon">{icon}</div>}
    <div className="ui-clickable-card-content">
      <h4 className="ui-clickable-card-title">{title}</h4>
      {subtitle && <p className="ui-clickable-card-subtitle">{subtitle}</p>}
    </div>
    <div className="ui-clickable-card-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </button>
)

// ============================================
// Icons
// ============================================
export const Icons = {
  Calendar: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  DollarSign: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Users: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  TrendingUp: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Plus: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Search: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Edit: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  ChevronDown: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Check: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Refresh: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M23 4v6h-6M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  X: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Star: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  FileText: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
}
