import { timeToMinutes, minutesToTime } from './availability'
import { parseLocalDateKey, toLocalDateKey } from './dates'

/** End datetime of a booking in local time */
export const getBookingEndDate = (booking) => {
  const day = parseLocalDateKey(booking.date)
  if (!day) return null
  const start = timeToMinutes(booking.reservedTime)
  const duration = Number(booking.durationMinutes) || 60
  const endMinutes = start + duration
  const end = new Date(day)
  end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0)
  return end
}

export const getBookingStartDate = (booking) => {
  const day = parseLocalDateKey(booking.date)
  if (!day) return null
  const start = timeToMinutes(booking.reservedTime)
  const d = new Date(day)
  d.setHours(Math.floor(start / 60), start % 60, 0, 0)
  return d
}

export const getBookingEndTime = (booking) => {
  const start = timeToMinutes(booking.reservedTime)
  const duration = Number(booking.durationMinutes) || 60
  return minutesToTime(start + duration)
}

/** Slot finished and still awaiting mini-admin service confirmation */
export const isAwaitingServiceConfirm = (booking, now = new Date()) => {
  if (!booking || booking.status !== 'Pending') return false
  const end = getBookingEndDate(booking)
  return end ? end <= now : false
}

export const isPaymentPending = (booking) =>
  booking?.status === 'Done' && booking?.paymentStatus === 'PaymentPending'

export const isPaymentApproved = (booking) =>
  booking?.paymentStatus === 'PaymentApproved'

export const isTodayBooking = (booking) => booking?.date === toLocalDateKey(new Date())
