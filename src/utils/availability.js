import { toLocalDateKey, parseLocalDateKey } from '../utils/dates'

/** Default business hours (24h). Sunday shorter end. */
export const DEFAULT_HOURS = {
  weekday: { open: 9 * 60, close: 22 * 60 }, // Mon–Sat 09:00–22:00
  sunday: { open: 9 * 60, close: 20 * 60 },  // Sun 09:00–20:00
}

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [h, m] = timeStr.substring(0, 5).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const getDayHours = (dateKey) => {
  const date = parseLocalDateKey(dateKey)
  if (!date) return DEFAULT_HOURS.weekday
  return date.getDay() === 0 ? DEFAULT_HOURS.sunday : DEFAULT_HOURS.weekday
}

/**
 * Normalize bookings / pending requests into busy intervals
 */
export const toBusyIntervals = (reservations = []) => {
  return reservations
    .filter((r) => r && r.date && r.reservedTime && r.status !== 'Canceled' && r.status !== 'Declined')
    .map((r) => {
      const start = timeToMinutes(r.reservedTime)
      const duration = Number(r.durationMinutes) || 60
      return {
        date: r.date,
        start,
        end: start + duration,
        roomId: r.roomId || null,
        centerId: r.centerId || null,
        therapistId: r.therapistId || null,
      }
    })
}

const intervalsOverlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd

const isRoomBlocked = (dayBusy, roomId, start, end) =>
  dayBusy.some(
    (b) =>
      (!b.roomId || b.roomId === roomId) &&
      intervalsOverlap(start, end, b.start, b.end)
  )

const isTherapistBlocked = (dayBusy, therapistId, start, end) => {
  if (!therapistId) return false
  return dayBusy.some(
    (b) =>
      b.therapistId === therapistId &&
      intervalsOverlap(start, end, b.start, b.end)
  )
}

/**
 * Generate available start times for a given day / room / duration
 * @param {string|null} options.therapistId - when set, that therapist's bookings block all rooms
 */
export const getAvailableSlots = ({
  dateKey,
  durationMinutes = 60,
  busyIntervals = [],
  roomId = null,
  roomIds = [],
  therapistId = null,
  stepMinutes = 30,
}) => {
  if (!dateKey) return []
  const { open, close } = getDayHours(dateKey)
  const duration = Number(durationMinutes) || 60
  const dayBusy = busyIntervals.filter((b) => b.date === dateKey)

  const slots = []
  for (let start = open; start + duration <= close; start += stepMinutes) {
    const end = start + duration

    // Therapist is busy → never offer this slot (any room)
    if (isTherapistBlocked(dayBusy, therapistId, start, end)) {
      continue
    }

    if (roomId) {
      if (!isRoomBlocked(dayBusy, roomId, start, end)) {
        slots.push(minutesToTime(start))
      }
    } else {
      // Need at least one free room among candidates
      const candidates = roomIds.length ? roomIds : [null]
      const hasFreeRoom = candidates.some((rid) => {
        if (!rid) {
          return !dayBusy.some((b) => intervalsOverlap(start, end, b.start, b.end))
        }
        return !isRoomBlocked(dayBusy, rid, start, end)
      })
      if (hasFreeRoom) {
        slots.push(minutesToTime(start))
      }
    }
  }
  return slots
}

/**
 * Day-level availability summary for calendar coloring
 */
export const getDayAvailabilityStatus = ({
  dateKey,
  durationMinutes,
  busyIntervals,
  roomId,
  roomIds,
  therapistId = null,
}) => {
  const today = toLocalDateKey(new Date())
  if (dateKey < today) return 'past'
  const slots = getAvailableSlots({
    dateKey,
    durationMinutes,
    busyIntervals,
    roomId,
    roomIds,
    therapistId,
  })
  if (slots.length === 0) return 'full'
  if (slots.length <= 2) return 'limited'
  return 'available'
}
