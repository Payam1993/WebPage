import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Button,
  PageHeader,
  Icons,
  LoadingState,
  Select,
} from '../../components/admin/ui'
import { bookingAPI, centerAPI, roomAPI } from '../../services/dataService'
import { useAuth } from '../../context/AuthContext'
import { toLocalDateKey } from '../../utils/dates'
import { timeToMinutes, minutesToTime } from '../../utils/availability'
import { staffT as t } from '../../i18n/staffEs'

const HOUR_START = 9
const HOUR_END = 22 // exclusive end for grid labels through 21:00
const HOUR_HEIGHT_WEEK = 56
const HOUR_HEIGHT_DAY = 72

/**
 * Calendar - pending bookings spanning full duration
 */
const Calendar = () => {
  const { isUser, isAdmin, isMiniAdmin, staffProfile, isLoading: authLoading } = useAuth()
  const isIndividualView = isUser
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week')
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [centers, setCenters] = useState([])
  const [rooms, setRooms] = useState([])
  const [filterCenterId, setFilterCenterId] = useState('')
  const [filterRoomId, setFilterRoomId] = useState('')

  const hours = useMemo(
    () => Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i),
    []
  )
  const daysOfWeek = t.calendar.daysShort

  useEffect(() => {
    loadCentersAndRooms()
  }, [])

  useEffect(() => {
    if (authLoading) return
    loadEvents()
  }, [currentDate, viewMode, authLoading, isIndividualView, staffProfile?.id, filterCenterId, filterRoomId])

  const loadCentersAndRooms = async () => {
    try {
      const [centersData, roomsData] = await Promise.all([centerAPI.list(), roomAPI.list()])
      setCenters(centersData)
      setRooms(roomsData)
    } catch (err) {
      console.error('Error loading centers/rooms:', err)
    }
  }

  const mapBookingEvent = (booking) => ({
    id: booking.id,
    title: booking.clientName,
    time: booking.reservedTime?.substring(0, 5) || '00:00',
    duration: Number(booking.durationMinutes) || 60,
    therapist: booking.therapistName || t.common.unassigned,
    therapistId: booking.therapistId,
    service: booking.serviceName || null,
    center: booking.centerName || null,
    room: booking.roomName || '-',
    date: booking.date,
    color: getTherapistColor(booking.therapistName),
    clientPhone: booking.clientPhone,
    price: booking.priceAgreement,
    raw: booking,
  })

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      if (isIndividualView && !staffProfile?.id) {
        setEvents([])
        return
      }
      const dateRange = getDateRange()
      const filterOptions = {
        ...(isIndividualView && staffProfile?.id ? { therapistId: staffProfile.id } : {}),
        ...(filterCenterId ? { centerId: filterCenterId } : {}),
        ...(filterRoomId ? { roomId: filterRoomId } : {}),
      }
      const bookings = await bookingAPI.listPending(dateRange.from, dateRange.to, filterOptions)
      setEvents(bookings.map(mapBookingEvent))
    } catch (error) {
      console.error('Error loading calendar events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const centerOptions = [
    { value: '', label: t.calendar.allCenters },
    ...centers.map((c) => ({
      value: c.id,
      label: `${c.centerName}${c.referenceNumber ? ` (${c.referenceNumber})` : ''}`,
    })),
  ]

  const roomOptions = [
    { value: '', label: t.calendar.allRooms },
    ...rooms
      .filter((r) => !filterCenterId || r.centerId === filterCenterId)
      .map((r) => ({
        value: r.id,
        label: `${r.roomName}${r.referenceNumber ? ` (${r.referenceNumber})` : ''}`,
      })),
  ]

  const viewModeLabels = {
    day: t.calendar.day,
    week: t.calendar.week,
    month: t.calendar.month,
  }

  const handleCenterFilterChange = (centerId) => {
    setFilterCenterId(centerId)
    if (centerId && filterRoomId) {
      const room = rooms.find((r) => r.id === filterRoomId)
      if (room && room.centerId !== centerId) setFilterRoomId('')
    }
  }

  const getDateRange = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    if (viewMode === 'month') {
      return {
        from: formatDateKey(new Date(year, month, 1)),
        to: formatDateKey(new Date(year, month + 1, 0)),
      }
    }
    if (viewMode === 'week') {
      const weekDays = getWeekDays()
      return { from: formatDateKey(weekDays[0]), to: formatDateKey(weekDays[6]) }
    }
    return { from: formatDateKey(currentDate), to: formatDateKey(currentDate) }
  }

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
    const startPadding = (firstDay.getDay() + 6) % 7
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const endPadding = 42 - days.length
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
  }

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = startOfWeek.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startOfWeek.setDate(startOfWeek.getDate() + diff)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const formatDateKey = (date) => toLocalDateKey(date)

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction)
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + direction * 7)
    else newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (date) => date.toDateString() === new Date().toDateString()

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date)
    return events.filter((event) => event.date === dateKey)
  }

  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return ''
    return minutesToTime(timeToMinutes(startTime) + (Number(durationMinutes) || 60))
  }

  const eventLayout = (event, hourHeight) => {
    const startMin = timeToMinutes(event.time)
    const gridStart = HOUR_START * 60
    const top = ((startMin - gridStart) / 60) * hourHeight
    const height = Math.max(((Number(event.duration) || 60) / 60) * hourHeight, hourHeight * 0.35)
    return { top, height }
  }

  const gridHeight = hours.length * HOUR_HEIGHT_WEEK
  const dayGridHeight = hours.length * HOUR_HEIGHT_DAY

  const renderSpanningEvent = (event, hourHeight) => {
    const { top, height } = eventLayout(event, hourHeight)
    return (
      <div
        key={event.id}
        style={{
          position: 'absolute',
          left: 4,
          right: 4,
          top,
          height: height - 2,
          padding: '6px 8px',
          background: event.color,
          color: 'white',
          borderRadius: 6,
          fontSize: '0.75rem',
          overflow: 'hidden',
          zIndex: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          cursor: 'default',
        }}
        title={`${event.title}\n${event.time} – ${getEndTime(event.time, event.duration)}\n${event.duration} min\n${event.room}\n${event.therapist}`}
      >
        <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{event.title}</div>
        <div style={{ opacity: 0.9, fontSize: '0.6875rem', marginTop: 2 }}>
          {event.time} – {getEndTime(event.time, event.duration)}
        </div>
        {height > 48 && (
          <div style={{ opacity: 0.85, fontSize: '0.6875rem' }}>
            {event.duration} min · {event.room}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isIndividualView ? t.calendar.myTitle : t.calendar.title}
        subtitle={
          isIndividualView
            ? t.calendar.mySubtitle
            : t.calendar.subtitle
        }
        actions={
          <Button variant="secondary" onClick={loadEvents}>
            <Icons.Search /> {t.common.refresh}
          </Button>
        }
      />

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="secondary" size="small" onClick={() => navigateDate(-1)}>
              ‹
            </Button>
            <h2 style={{ margin: 0, minWidth: 200, textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
              {viewMode === 'month'
                ? currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                  ? `${t.calendar.weekOf} ${getWeekDays()[0].toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`
                  : currentDate.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <Button variant="secondary" size="small" onClick={() => navigateDate(1)}>
              ›
            </Button>
            <Button variant="ghost" size="small" onClick={() => setCurrentDate(new Date())}>
              {t.common.today}
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {['day', 'week', 'month'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode(mode)}
              >
                {viewModeLabels[mode]}
              </Button>
            ))}
            {(isAdmin || isMiniAdmin) && (
              <>
                <Select
                  label={t.common.center}
                  options={centerOptions}
                  value={filterCenterId}
                  onChange={(e) => handleCenterFilterChange(e.target.value)}
                  containerClassName="ui-mb-0"
                  style={{ minWidth: 160 }}
                />
                <Select
                  label={t.common.room}
                  options={roomOptions}
                  value={filterRoomId}
                  onChange={(e) => setFilterRoomId(e.target.value)}
                  containerClassName="ui-mb-0"
                  style={{ minWidth: 160 }}
                />
              </>
            )}
          </div>
        </div>
      </Card>

      <Card padding={false}>
        {isLoading ? (
          <div style={{ padding: 48 }}>
            <LoadingState text={t.calendar.loading} />
          </div>
        ) : viewMode === 'month' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--ui-border)' }}>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                style={{
                  padding: 12,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  background: 'var(--ui-bg)',
                  color: 'var(--ui-text-muted)',
                }}
              >
                {day}
              </div>
            ))}
            {getMonthDays().map(({ date, isCurrentMonth }, index) => {
              const dayEvents = getEventsForDate(date)
              return (
                <div
                  key={index}
                  style={{
                    minHeight: 100,
                    padding: 8,
                    background: 'var(--ui-bg-card)',
                    opacity: isCurrentMonth ? 1 : 0.4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        fontSize: '0.8125rem',
                        fontWeight: isToday(date) ? 600 : 400,
                        background: isToday(date) ? 'var(--ui-primary)' : 'transparent',
                        color: isToday(date) ? 'white' : 'inherit',
                      }}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      style={{
                        padding: '4px 8px',
                        marginBottom: 4,
                        background: `${event.color}15`,
                        borderLeft: `3px solid ${event.color}`,
                        borderRadius: 4,
                        fontSize: '0.6875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.time}–{getEndTime(event.time, event.duration)} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: '0.6875rem', color: 'var(--ui-primary)', textAlign: 'center' }}>
                      +{dayEvents.length - 2} {t.calendar.more}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : viewMode === 'week' ? (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px repeat(7, 1fr)',
                  borderBottom: '1px solid var(--ui-border)',
                }}
              >
                <div style={{ borderRight: '1px solid var(--ui-border)' }} />
                {getWeekDays().map((date, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 12,
                      textAlign: 'center',
                      borderRight: index < 6 ? '1px solid var(--ui-border)' : 'none',
                      background: isToday(date) ? 'var(--ui-primary-light)' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ui-text-muted)' }}>
                      {daysOfWeek[index]}
                    </div>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: isToday(date) ? 600 : 400,
                        color: isToday(date) ? 'var(--ui-primary)' : 'var(--ui-text)',
                      }}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(7, 1fr)' }}>
                <div style={{ position: 'relative', height: gridHeight, borderRight: '1px solid var(--ui-border)' }}>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      style={{
                        height: HOUR_HEIGHT_WEEK,
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        color: 'var(--ui-text-muted)',
                        textAlign: 'right',
                        borderBottom: '1px solid var(--ui-border-light)',
                      }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
                {getWeekDays().map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    style={{
                      position: 'relative',
                      height: gridHeight,
                      borderRight: dayIndex < 6 ? '1px solid var(--ui-border)' : 'none',
                      background: isToday(date) ? 'rgba(37, 99, 235, 0.02)' : 'transparent',
                    }}
                  >
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: (hour - HOUR_START) * HOUR_HEIGHT_WEEK,
                          height: HOUR_HEIGHT_WEEK,
                          borderBottom: '1px solid var(--ui-border-light)',
                          pointerEvents: 'none',
                        }}
                      />
                    ))}
                    {getEventsForDate(date).map((event) => renderSpanningEvent(event, HOUR_HEIGHT_WEEK))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 64, flexShrink: 0, borderRight: '1px solid var(--ui-border)' }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: HOUR_HEIGHT_DAY,
                    padding: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--ui-text-muted)',
                    textAlign: 'right',
                    borderBottom: '1px solid var(--ui-border-light)',
                  }}
                >
                  {hour}:00
                </div>
              ))}
            </div>
            <div style={{ flex: 1, position: 'relative', height: dayGridHeight }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: (hour - HOUR_START) * HOUR_HEIGHT_DAY,
                    height: HOUR_HEIGHT_DAY,
                    borderBottom: '1px solid var(--ui-border-light)',
                  }}
                />
              ))}
              {getEventsForDate(currentDate).length === 0 && (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--ui-text-muted)' }}>
                  {t.calendar.noAppointments}
                </div>
              )}
              {getEventsForDate(currentDate).map((event) => renderSpanningEvent(event, HOUR_HEIGHT_DAY))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Calendar
