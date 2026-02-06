import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  PageHeader,
  Icons,
} from '../../components/admin/ui'

/**
 * Calendar - Visual calendar view of bookings and schedule
 */
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'day', 'week', 'month'

  // Sample events - replace with real data from your API
  const events = [
    { id: 1, title: 'Deep Tissue - Maria', time: '10:00', duration: 60, therapist: 'Luciana', date: '2026-01-20', color: '#2563eb' },
    { id: 2, title: 'Swedish - John', time: '14:00', duration: 90, therapist: 'Sadey', date: '2026-01-20', color: '#10b981' },
    { id: 3, title: 'Hot Stone - Anna', time: '11:00', duration: 75, therapist: 'Luciana', date: '2026-01-21', color: '#2563eb' },
    { id: 4, title: 'Aromatherapy - Carlos', time: '16:00', duration: 60, therapist: 'Sadey', date: '2026-01-21', color: '#10b981' },
    { id: 5, title: 'Couples - Emma', time: '15:00', duration: 90, therapist: 'Both', date: '2026-01-22', color: '#f59e0b' },
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
    <div>
      <PageHeader 
        title="Calendar"
        subtitle="View and manage your schedule"
        actions={
          <Button icon={<Icons.Plus />}>
            Add Event
          </Button>
        }
      />

      {/* Calendar Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => navigateDate(-1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </Button>
            <h2 style={{ margin: 0, minWidth: '200px', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                  ? `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              }
            </h2>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => navigateDate(1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['day', 'week', 'month'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      <Card padding={false}>
        {viewMode === 'month' ? (
          /* Month View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--ui-border)' }}>
            {/* Day Headers */}
            {daysOfWeek.map((day) => (
              <div 
                key={day} 
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontWeight: 600, 
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'var(--ui-bg)',
                  color: 'var(--ui-text-muted)'
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
                    padding: '8px',
                    background: 'var(--ui-bg-card)',
                    opacity: isCurrentMonth ? 1 : 0.4
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '0.8125rem',
                      fontWeight: isToday(date) ? 600 : 400,
                      background: isToday(date) ? 'var(--ui-primary)' : 'transparent',
                      color: isToday(date) ? 'white' : 'inherit'
                    }}>
                      {date.getDate()}
                    </span>
                  </div>
                  {dayEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      style={{ 
                        padding: '4px 8px',
                        marginBottom: '4px',
                        background: `${event.color}15`,
                        borderLeft: `3px solid ${event.color}`,
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--ui-text)'
                      }}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: '0.6875rem', color: 'var(--ui-primary)', textAlign: 'center' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid var(--ui-border)' }}>
                <div style={{ padding: '16px', borderRight: '1px solid var(--ui-border)' }}></div>
                {getWeekDays().map((date, index) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      borderRight: index < 6 ? '1px solid var(--ui-border)' : 'none',
                      background: isToday(date) ? 'var(--ui-primary-light)' : 'transparent'
                    }}
                  >
                    <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ui-text-muted)', letterSpacing: '0.05em' }}>
                      {daysOfWeek[index]}
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem',
                      fontWeight: isToday(date) ? 600 : 400,
                      color: isToday(date) ? 'var(--ui-primary)' : 'var(--ui-text)'
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
                  style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid var(--ui-border-light)' }}
                >
                  <div style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.75rem', 
                    color: 'var(--ui-text-muted)',
                    textAlign: 'right',
                    borderRight: '1px solid var(--ui-border)'
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
                          padding: '4px',
                          borderRight: dayIndex < 6 ? '1px solid var(--ui-border)' : 'none',
                          background: isToday(date) ? 'rgba(37, 99, 235, 0.02)' : 'transparent'
                        }}
                      >
                        {dayEvents.map((event) => (
                          <div 
                            key={event.id}
                            style={{ 
                              padding: '8px',
                              background: event.color,
                              color: 'white',
                              borderRadius: '6px',
                              fontSize: '0.75rem'
                            }}
                          >
                            <div style={{ fontWeight: 500 }}>{event.title}</div>
                            <div style={{ opacity: 0.85, fontSize: '0.6875rem' }}>{event.duration} min</div>
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
                    borderBottom: '1px solid var(--ui-border-light)',
                    minHeight: '80px'
                  }}
                >
                  <div style={{ 
                    width: '80px',
                    padding: '16px',
                    fontSize: '0.8125rem',
                    color: 'var(--ui-text-muted)',
                    flexShrink: 0,
                    borderRight: '1px solid var(--ui-border)'
                  }}>
                    {hour}:00
                  </div>
                  <div style={{ flex: 1, padding: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {hourEvents.map((event) => (
                      <div 
                        key={event.id}
                        style={{ 
                          padding: '16px',
                          background: event.color,
                          color: 'white',
                          borderRadius: '8px',
                          minWidth: '200px'
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{event.title}</div>
                        <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>{event.duration} min • {event.therapist}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Calendar
