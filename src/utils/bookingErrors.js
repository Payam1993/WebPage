/** Structured booking-guard error codes from Lambda */
export const BOOKING_ERROR = {
  THERAPIST_CONFLICT: 'THERAPIST_CONFLICT',
  ROOM_CONFLICT: 'ROOM_CONFLICT',
  THERAPIST_REQUIRED: 'THERAPIST_REQUIRED',
  ROOM_REQUIRED: 'ROOM_REQUIRED',
  INVALID_TIME: 'INVALID_TIME',
  UNAUTHORIZED_BOOKING_ACTION: 'UNAUTHORIZED_BOOKING_ACTION',
  ALREADY_CONFIRMED: 'ALREADY_CONFIRMED',
}

const DEFAULT_MESSAGES = {
  THERAPIST_CONFLICT: 'This therapist is already booked at this time.',
  ROOM_CONFLICT: 'This room is already reserved at this time.',
  THERAPIST_REQUIRED: 'Please select a therapist before confirming.',
  ROOM_REQUIRED: 'Please select a room before confirming.',
  INVALID_TIME: 'Please choose a valid date and time.',
  UNAUTHORIZED_BOOKING_ACTION: 'You are not allowed to perform this booking action.',
  ALREADY_CONFIRMED: 'This reservation was already confirmed.',
}

/**
 * Map a guard result or thrown error into a staff-facing message.
 * Prefers i18n map when provided (keys = error codes).
 */
export const bookingErrorMessage = (errorOrResult, i18nMap = null) => {
  const code =
    errorOrResult?.errorCode ||
    errorOrResult?.code ||
    (typeof errorOrResult?.message === 'string' &&
    Object.prototype.hasOwnProperty.call(DEFAULT_MESSAGES, errorOrResult.message)
      ? errorOrResult.message
      : null)

  if (code && i18nMap?.[code]) return i18nMap[code]
  if (code && DEFAULT_MESSAGES[code]) return DEFAULT_MESSAGES[code]

  const msg = errorOrResult?.message || errorOrResult?.errorCode
  if (msg && !/AWS|DynamoDB|Lambda|AppSync|GraphQL|ValidationException/i.test(String(msg))) {
    return String(msg)
  }
  return i18nMap?.GENERIC || 'Could not save the booking. Please try again.'
}

export class BookingGuardError extends Error {
  constructor(errorCode, message) {
    super(message || DEFAULT_MESSAGES[errorCode] || errorCode)
    this.name = 'BookingGuardError'
    this.errorCode = errorCode
  }
}

export const assertGuardOk = (result) => {
  if (result?.ok) {
    let booking = result.booking
    if (typeof booking === 'string') {
      try {
        booking = JSON.parse(booking)
      } catch {
        /* keep string */
      }
    }
    if (booking) return booking
  }

  // Idempotent confirm retry — return booking when present; else soft-success signal
  if (result?.errorCode === 'ALREADY_CONFIRMED') {
    let booking = result.booking
    if (typeof booking === 'string') {
      try {
        booking = JSON.parse(booking)
      } catch {
        /* keep */
      }
    }
    if (booking) return booking
    throw new BookingGuardError(
      'ALREADY_CONFIRMED',
      result?.message || DEFAULT_MESSAGES.ALREADY_CONFIRMED
    )
  }

  const code = result?.errorCode || 'INVALID_TIME'
  throw new BookingGuardError(code, result?.message || DEFAULT_MESSAGES[code])
}
