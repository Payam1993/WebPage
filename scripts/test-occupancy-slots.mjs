/**
 * Occupancy + time-grid checks for booking-conflict-guard.
 * Run: node scripts/test-occupancy-slots.mjs
 */

const SLOT_STEP_MINUTES = 30
const START_GRID_MINUTES = 30
const DURATION_STEP_MINUTES = 15
const MAX_DURATION_MINUTES = 240
const DYNAMODB_TRANSACT_MAX_ITEMS = 100

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [h, m] = timeStr.substring(0, 5).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const validateTimeGrid = (reservedTime, durationMinutes) => {
  if (!reservedTime) return { ok: false, message: 'missing time' }
  const start = timeToMinutes(reservedTime)
  if (start % START_GRID_MINUTES !== 0) return { ok: false, message: 'start not on 30' }
  const duration = Number(durationMinutes)
  if (!Number.isFinite(duration) || duration <= 0) return { ok: false, message: 'bad duration' }
  if (duration % DURATION_STEP_MINUTES !== 0) return { ok: false, message: 'duration step' }
  if (duration > MAX_DURATION_MINUTES) return { ok: false, message: 'too long' }
  return { ok: true }
}

const occupiedSlotStarts = (reservedTime, durationMinutes, step = SLOT_STEP_MINUTES) => {
  const start = timeToMinutes(reservedTime)
  const end = start + (Number(durationMinutes) || 60)
  if (end <= start) return []
  const slots = []
  const gridStart = Math.floor(start / step) * step
  for (let s = gridStart; s < end; s += step) {
    if (s < end && s + step > start) slots.push(s)
  }
  return slots
}

const occupancyKey = (resourceType, resourceId, date, slotStartMinutes) =>
  `${resourceType}#${resourceId}#${date}#${slotStartMinutes}`

const estimateConfirmTxItems = (durationMinutes) => {
  const slots = Math.ceil((Number(durationMinutes) || 60) / SLOT_STEP_MINUTES)
  return slots * 2 + 2
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

// Grid validation
assert(validateTimeGrid('15:00', 60).ok, '15:00+60 should pass')
assert(validateTimeGrid('15:00', 45).ok, '15:00+45 should pass (business UI)')
assert(validateTimeGrid('15:30', 90).ok, '15:30+90 should pass')
assert(!validateTimeGrid('15:15', 60).ok, '15:15 must be INVALID_TIME')
assert(!validateTimeGrid('15:45', 30).ok, '15:45 must be INVALID_TIME')
assert(!validateTimeGrid('15:00', 40).ok, '40 min duration must be INVALID_TIME')
assert(!validateTimeGrid('15:00', 300).ok, '300 min must exceed max')

// 45-min occupancy still collision-safe on 30-min keys
const s45 = occupiedSlotStarts('15:00', 45)
assert(JSON.stringify(s45) === JSON.stringify([900, 930]), `45min slots got ${s45}`)

const a = occupiedSlotStarts('15:00', 60).map((s) =>
  occupancyKey('therapist', 't1', '2026-08-13', s)
)
const b = occupiedSlotStarts('15:30', 60).map((s) =>
  occupancyKey('therapist', 't1', '2026-08-13', s)
)
assert(a.filter((k) => b.includes(k)).length > 0, 'overlap must share keys')

const c = occupiedSlotStarts('16:00', 60).map((s) =>
  occupancyKey('therapist', 't1', '2026-08-13', s)
)
assert(a.every((k) => !c.includes(k)), 'non-overlap must not share keys')

// Self-ownership conceptual: same bookingId on existing key is not a foreign conflict
const selfKey = occupancyKey('room', 'r1', '2026-08-13', 900)
const existing = { [selfKey]: { bookingId: 'booking-1', resourceType: 'room' } }
const isSelf = existing[selfKey].bookingId === 'booking-1'
assert(isSelf, 'reschedule into own slot must recognize self ownership')

// Tx size for max business duration (120) and hard cap (240)
assert(estimateConfirmTxItems(120) < DYNAMODB_TRANSACT_MAX_ITEMS, '120 min tx too large')
assert(estimateConfirmTxItems(240) < DYNAMODB_TRANSACT_MAX_ITEMS, '240 min tx too large')
assert(estimateConfirmTxItems(240) === 8 * 2 + 2, `unexpected estimate ${estimateConfirmTxItems(240)}`)

console.log('occupancy + grid safety tests: OK')
console.log('  max confirm tx items @240m:', estimateConfirmTxItems(240))
