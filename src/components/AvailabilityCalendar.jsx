import { useEffect, useMemo, useState } from 'react'
import {
  publicAPI,
  bookingAPI,
  notConfirmedReservationAPI,
  getTodayDate,
  toLocalDateKey,
} from '../services/dataService'
import {
  toBusyIntervals,
  getAvailableSlots,
  getDayAvailabilityStatus,
} from '../utils/availability'
import './AvailabilityCalendar.css'

/**
 * AvailabilityCalendar - month picker + free time slots based on rooms & reservations
 */
const AvailabilityCalendar = ({
  centerId = '',
  roomId = '',
  roomIds = [],
  therapistId = '',
  durationMinutes = 60,
  selectedDate = '',
  selectedTime = '',
  onSelectDate,
  onSelectTime,
  authMode = 'public', // 'public' | 'staff'
  labels = {},
}) => {
  const [monthCursor, setMonthCursor] = useState(() => {
    const base = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })
  const [busyIntervals, setBusyIntervals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const todayKey = getTodayDate()

  const monthStart = useMemo(
    () => new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1),
    [monthCursor]
  )
  const monthEnd = useMemo(
    () => new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0),
    [monthCursor]
  )

  useEffect(() => {
    loadBusy()
  }, [centerId, roomId, therapistId, monthCursor, authMode])

  const loadBusy = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fromDate = toLocalDateKey(monthStart)
      const toDate = toLocalDateKey(monthEnd)
      let raw = []
      if (authMode === 'staff') {
        // Center occupancy + this therapist's bookings (central calendar rules)
        const [centerBookings, therapistBookings, pending] = await Promise.all([
          bookingAPI.list(fromDate, toDate, {
            ...(centerId ? { centerId } : {}),
          }),
          therapistId
            ? bookingAPI.list(fromDate, toDate, { therapistId })
            : Promise.resolve([]),
          notConfirmedReservationAPI.list(fromDate, toDate),
        ])
        const byId = new Map()
        ;[...centerBookings, ...therapistBookings].forEach((b) => {
          if (b?.id) byId.set(b.id, b)
        })
        raw = [
          ...byId.values(),
          ...pending.filter(
            (p) =>
              (!centerId || p.centerId === centerId) ||
              (therapistId && p.therapistId === therapistId)
          ),
        ]
      } else {
        raw = await publicAPI.listBusySlots({
          fromDate,
          toDate,
          centerId: centerId || null,
          therapistId: therapistId || null,
        })
      }
      setBusyIntervals(toBusyIntervals(raw))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to load availability')
      setBusyIntervals([])
    } finally {
      setIsLoading(false)
    }
  }

  const days = useMemo(() => {
    const year = monthCursor.getFullYear()
    const month = monthCursor.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    let startDow = firstDay.getDay()
    startDow = startDow === 0 ? 6 : startDow - 1 // Monday-first
    const cells = []
    for (let i = 0; i < startDow; i++) cells.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(new Date(year, month, d))
    }
    return cells
  }, [monthCursor])

  const slots = useMemo(() => {
    if (!selectedDate) return []
    return getAvailableSlots({
      dateKey: selectedDate,
      durationMinutes,
      busyIntervals,
      roomId: roomId || null,
      roomIds,
      therapistId: therapistId || null,
    })
  }, [selectedDate, durationMinutes, busyIntervals, roomId, roomIds, therapistId])

  const navigateMonth = (delta) => {
    setMonthCursor(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    )
  }

  const handleDayClick = (date) => {
    if (!date) return
    const key = toLocalDateKey(date)
    if (key < todayKey) return
    onSelectDate?.(key)
    if (selectedTime) {
      const nextSlots = getAvailableSlots({
        dateKey: key,
        durationMinutes,
        busyIntervals,
        roomId: roomId || null,
        roomIds,
        therapistId: therapistId || null,
      })
      if (!nextSlots.includes(selectedTime.substring(0, 5))) {
        onSelectTime?.('')
      }
    }
  }

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="availability-calendar">
      <div className="availability-calendar__header">
        <button type="button" className="availability-calendar__nav" onClick={() => navigateMonth(-1)} aria-label="Previous month">
          ‹
        </button>
        <h4>
          {monthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h4>
        <button type="button" className="availability-calendar__nav" onClick={() => navigateMonth(1)} aria-label="Next month">
          ›
        </button>
      </div>

      {!centerId && (
        <p className="availability-calendar__hint">
          {labels.selectCenterFirst || 'Select a center to see room availability.'}
        </p>
      )}

      {error && <div className="availability-calendar__error">{error}</div>}

      <div className={`availability-calendar__grid ${!centerId ? 'is-disabled' : ''}`}>
        {weekLabels.map((w) => (
          <div key={w} className="availability-calendar__dow">{w}</div>
        ))}
        {days.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} className="availability-calendar__day is-empty" />
          const key = toLocalDateKey(date)
          const status = centerId
            ? getDayAvailabilityStatus({
                dateKey: key,
                durationMinutes,
                busyIntervals,
                roomId: roomId || null,
                roomIds,
                therapistId: therapistId || null,
              })
            : 'disabled'
          const isSelected = selectedDate === key
          const isToday = key === todayKey
          return (
            <button
              key={key}
              type="button"
              className={[
                'availability-calendar__day',
                `is-${status}`,
                isSelected ? 'is-selected' : '',
                isToday ? 'is-today' : '',
              ].join(' ')}
              disabled={status === 'past' || status === 'disabled' || !centerId}
              onClick={() => handleDayClick(date)}
            >
              <span>{date.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div className="availability-calendar__legend">
        <span className="leg available">{labels.available || 'Available'}</span>
        <span className="leg limited">{labels.limited || 'Limited'}</span>
        <span className="leg full">{labels.full || 'Full'}</span>
      </div>

      {selectedDate && centerId && (
        <div className="availability-calendar__slots">
          <div className="availability-calendar__slots-title">
            {labels.slotsTitle || 'Available times'} — {selectedDate}
            {isLoading ? ` (${labels.loading || 'loading…'})` : ''}
          </div>
          {slots.length === 0 ? (
            <p className="availability-calendar__hint">
              {labels.noSlots || 'No available slots for this day. Try another date or room.'}
            </p>
          ) : (
            <div className="availability-calendar__slot-list">
              {slots.map((slot) => {
                const active = selectedTime?.substring(0, 5) === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`availability-calendar__slot ${active ? 'is-active' : ''}`}
                    onClick={() => onSelectTime?.(slot)}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AvailabilityCalendar
