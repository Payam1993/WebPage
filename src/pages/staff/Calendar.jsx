import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  PageHeader,
  Icons,
  LoadingState,
} from '../../components/admin/ui'
import { bookingAPI } from '../../services/dataService'

/**
 * Calendar - Visual calendar view of pending bookings
 * Shows bookings with status "Pending" from the Booking model
 * Done and Canceled bookings do not appear in the calendar
 */
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'day', 'week', 'month'
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 12 }, (_, i) => i + 9) // 9 AM to 8 PM

  // Load confirmed bookings when date/view changes
  useEffect(() => {
    loadEvents()
  }, [currentDate, viewMode])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const dateRange = getDateRange()
      const bookings = await bookingAPI.listPending(dateRange.from, dateRange.to)
      
      // Transform bookings to calendar events
      const calendarEvents = bookings.map(booking => ({
        id: booking.id,
        title: `${booking.clientName}`,
        time: booking.reservedTime?.substring(0, 5) || '00:00',
        duration: booking.durationMinutes || 60,
        therapist: booking.therapistName || 'Unassigned',
        service: booking.serviceName || null,
        date: booking.date,
        color: getTherapistColor(booking.therapistName),
        clientPhone: booking.clientPhone,
        price: booking.priceAgreement,
      }))
      
      setEvents(calendarEvents)
    } catch (error) {
      console.error('Error loading calendar events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get date range based on current view
  const getDateRange = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    if (viewMode === 'month') {
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      return {
        from: formatDateKey(firstDay),
        to: formatDateKey(lastDay)
      }
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays()
      return {
        from: formatDateKey(weekDays[0]),
        to: formatDateKey(weekDays[6])
      }
    } else {
      return {
        from: formatDateKey(currentDate),
        to: formatDateKey(currentDate)
      }
    }
  }

  // Assign colors based on therapist name
  const getTherapistColor = (therapistName) => {
    if (!therapistName) return '#6b7280'
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const hash = therapistName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

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

  // Calculate end time for display
  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return ''
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <PageHeader 
        title="Calendar"
        subtitle="View pending appointments awaiting completion"
        actions={
          <Button variant="secondary" onClick={loadEvents}>
            <Icons.Search /> Refresh
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
        {isLoading ? (
          <div style={{ padding: '48px' }}>
            <LoadingState text="Loading calendar..." />
          </div>
        ) : viewMode === 'month' ? (
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
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                            title={`${event.title}\n${event.time} - ${getEndTime(event.time, event.duration)}\n${event.service ? `Service: ${event.service}\n` : ''}Therapist: ${event.therapist}\nPrice: €${event.price?.toFixed(2) || '0.00'}`}
                          >
                            <div style={{ fontWeight: 500 }}>{event.title}</div>
                            <div style={{ opacity: 0.85, fontSize: '0.6875rem' }}>
                              {event.service && <span>{event.service} • </span>}
                              {event.duration} min • {event.therapist}
                            </div>
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
            {events.length === 0 && !isLoading && (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--ui-text-muted)' }}>
                No pending appointments for this day
              </div>
            )}
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
                          minWidth: '200px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{event.title}</div>
                        {event.service && (
                          <div style={{ fontSize: '0.8125rem', opacity: 0.9, fontStyle: 'italic' }}>
                            {event.service}
                          </div>
                        )}
                        <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>
                          {event.time} - {getEndTime(event.time, event.duration)}
                        </div>
                        <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>
                          {event.duration} min • {event.therapist}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>
                          €{event.price?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card style={{ marginTop: '24px' }}>
        <CardHeader>
          <CardTitle>Calendar Info</CardTitle>
        </CardHeader>
        <div style={{ fontSize: '0.875rem', color: 'var(--ui-text-muted)' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Note:</strong> Only bookings with status "Pending" are displayed on the calendar.
          </p>
          <p style={{ margin: 0 }}>
            When a reservation is marked as "Done" or "Canceled", it will disappear from the calendar.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Calendar
