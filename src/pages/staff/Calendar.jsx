import { useState } from 'react'

/**
 * Calendar - Visual calendar view of bookings and schedule
 */
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'day', 'week', 'month'

  // Sample events - replace with real data from your API
  const events = [
    { id: 1, title: 'Deep Tissue - Maria', time: '10:00', duration: 60, therapist: 'Luciana', date: '2026-01-20' },
    { id: 2, title: 'Swedish - John', time: '14:00', duration: 90, therapist: 'Sadey', date: '2026-01-20' },
    { id: 3, title: 'Hot Stone - Anna', time: '11:00', duration: 75, therapist: 'Luciana', date: '2026-01-21' },
    { id: 4, title: 'Aromatherapy - Carlos', time: '16:00', duration: 60, therapist: 'Sadey', date: '2026-01-21' },
    { id: 5, title: 'Couples - Emma', time: '15:00', duration: 90, therapist: 'Both', date: '2026-01-22' },
  ]

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 12 }, (_, i) => i + 9) // 9 AM to 8 PM

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    // Add padding for days before the first of the month
    const startPadding = (firstDay.getDay() + 6) % 7 // Adjust for Monday start
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }
    
    // Add all days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    
    // Add padding for remaining cells
    const endPadding = 42 - days.length // 6 weeks * 7 days
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    
    return days
  }

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = startOfWeek.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust for Monday start
    startOfWeek.setDate(startOfWeek.getDate() + diff)
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7))
    } else {
      newDate.setDate(newDate.getDate() + direction)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date)
    return events.filter(event => event.date === dateKey)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Calendar</h1>
        <p>View and manage your schedule</p>
      </div>

      {/* Calendar Controls */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="admin-btn secondary" 
              style={{ padding: '0.5rem' }}
              onClick={() => navigateDate(-1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2 style={{ margin: 0, minWidth: '200px', textAlign: 'center' }}>
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                  ? `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              }
            </h2>
            <button 
              className="admin-btn secondary" 
              style={{ padding: '0.5rem' }}
              onClick={() => navigateDate(1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <button 
              className="admin-btn secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`admin-btn ${viewMode === mode ? 'primary' : 'secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="admin-card">
        {viewMode === 'month' ? (
          /* Month View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(42, 42, 42, 0.08)' }}>
            {/* Day Headers */}
            {daysOfWeek.map((day) => (
              <div 
                key={day} 
                style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: 600, 
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'var(--color-cream, #f5f0eb)'
                }}
              >
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {getMonthDays().map(({ date, isCurrentMonth }, index) => {
              const dayEvents = getEventsForDate(date)
              return (
                <div 
                  key={index}
                  style={{ 
                    minHeight: '100px',
                    padding: '0.5rem',
                    background: 'white',
                    opacity: isCurrentMonth ? 1 : 0.4
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '0.85rem',
                      fontWeight: isToday(date) ? 600 : 400,
                      background: isToday(date) ? 'var(--color-terracotta, #c4785a)' : 'transparent',
                      color: isToday(date) ? 'white' : 'inherit'
                    }}>
                      {date.getDate()}
                    </span>
                  </div>
                  {dayEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      style={{ 
                        padding: '0.25rem 0.5rem',
                        marginBottom: '0.25rem',
                        background: 'rgba(196, 120, 90, 0.15)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-terracotta)', textAlign: 'center' }}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : viewMode === 'week' ? (
          /* Week View */
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '800px' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid rgba(42, 42, 42, 0.08)' }}>
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(42, 42, 42, 0.08)' }}></div>
                {getWeekDays().map((date, index) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: index < 6 ? '1px solid rgba(42, 42, 42, 0.08)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6 }}>
                      {daysOfWeek[index]}
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem',
                      fontWeight: isToday(date) ? 600 : 400,
                      color: isToday(date) ? 'var(--color-terracotta)' : 'inherit'
                    }}>
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Time slots */}
              {hours.map((hour) => (
                <div 
                  key={hour}
                  style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid rgba(42, 42, 42, 0.04)' }}
                >
                  <div style={{ 
                    padding: '0.5rem', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-charcoal)',
                    opacity: 0.5,
                    textAlign: 'right',
                    paddingRight: '1rem',
                    borderRight: '1px solid rgba(42, 42, 42, 0.08)'
                  }}>
                    {hour}:00
                  </div>
                  {getWeekDays().map((date, dayIndex) => {
                    const dayEvents = getEventsForDate(date).filter(e => parseInt(e.time) === hour)
                    return (
                      <div 
                        key={dayIndex}
                        style={{ 
                          minHeight: '60px',
                          padding: '0.25rem',
                          borderRight: dayIndex < 6 ? '1px solid rgba(42, 42, 42, 0.08)' : 'none',
                          background: isToday(date) ? 'rgba(196, 120, 90, 0.03)' : 'transparent'
                        }}
                      >
                        {dayEvents.map((event) => (
                          <div 
                            key={event.id}
                            style={{ 
                              padding: '0.5rem',
                              background: 'var(--color-terracotta)',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}
                          >
                            <div style={{ fontWeight: 500 }}>{event.title}</div>
                            <div style={{ opacity: 0.8 }}>{event.duration} min</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Day View */
          <div>
            {hours.map((hour) => {
              const hourEvents = events.filter(e => e.date === formatDateKey(currentDate) && parseInt(e.time) === hour)
              return (
                <div 
                  key={hour}
                  style={{ 
                    display: 'flex',
                    borderBottom: '1px solid rgba(42, 42, 42, 0.08)',
                    minHeight: '80px'
                  }}
                >
                  <div style={{ 
                    width: '80px',
                    padding: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-charcoal)',
                    opacity: 0.6,
                    flexShrink: 0
                  }}>
                    {hour}:00
                  </div>
                  <div style={{ flex: 1, padding: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {hourEvents.map((event) => (
                      <div 
                        key={event.id}
                        style={{ 
                          padding: '1rem',
                          background: 'var(--color-terracotta)',
                          color: 'white',
                          borderRadius: '8px',
                          minWidth: '200px'
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{event.title}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{event.duration} min • {event.therapist}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendar
