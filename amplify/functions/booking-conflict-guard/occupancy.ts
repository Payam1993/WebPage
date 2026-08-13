/** 30-minute granules — must match src/utils/availability.js stepMinutes */
export const SLOT_STEP_MINUTES = 30;

/** Business calendar start alignment (AvailabilityCalendar step). */
export const START_GRID_MINUTES = 30;

/**
 * Durations in the product UI are multiples of 15 (30/45/60/75/90/120).
 * Occupancy keys still use 30-min overlapping granules (collision-safe).
 */
export const DURATION_STEP_MINUTES = 15;

/** Hard cap so TransactWrite stays under DynamoDB's 100-item limit. */
export const MAX_DURATION_MINUTES = 240;

export type ResourceType = "therapist" | "room";

export const timeToMinutes = (timeStr: string | null | undefined): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.substring(0, 5).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const normalizeTime = (timeStr: string | null | undefined): string => {
  if (!timeStr) return "00:00:00";
  const hm = timeStr.substring(0, 5);
  return hm.length === 5 ? `${hm}:00` : timeStr;
};

/**
 * Validate start/duration for guarded writes.
 * - Start must sit on the 30-minute calendar grid
 * - Duration must be a positive multiple of 15 (supports 45/75)
 * - Duration capped for TransactWrite size
 */
export const validateTimeGrid = (
  reservedTime: string | null | undefined,
  durationMinutes: number | null | undefined
): { ok: true } | { ok: false; message: string } => {
  if (!reservedTime) return { ok: false, message: "Valid date and time are required" };
  const start = timeToMinutes(reservedTime);
  if (!Number.isFinite(start) || start < 0) {
    return { ok: false, message: "Valid date and time are required" };
  }
  if (start % START_GRID_MINUTES !== 0) {
    return {
      ok: false,
      message: "Start time must be on a 30-minute boundary (e.g. 15:00, 15:30)",
    };
  }
  const duration = Number(durationMinutes);
  if (!Number.isFinite(duration) || duration <= 0) {
    return { ok: false, message: "Duration must be positive" };
  }
  if (duration % DURATION_STEP_MINUTES !== 0) {
    return {
      ok: false,
      message: "Duration must be a multiple of 15 minutes",
    };
  }
  if (duration > MAX_DURATION_MINUTES) {
    return {
      ok: false,
      message: `Duration cannot exceed ${MAX_DURATION_MINUTES} minutes`,
    };
  }
  return { ok: true };
};

/**
 * Slot starts that overlap [start, start+duration) on the 30-min grid.
 * Safe for 45/75-minute durations when start is grid-aligned.
 */
export const occupiedSlotStarts = (
  reservedTime: string,
  durationMinutes: number,
  step = SLOT_STEP_MINUTES
): number[] => {
  const start = timeToMinutes(reservedTime);
  const end = start + (Number(durationMinutes) || 60);
  if (end <= start) return [];
  const slots: number[] = [];
  const gridStart = Math.floor(start / step) * step;
  for (let s = gridStart; s < end; s += step) {
    if (s < end && s + step > start) slots.push(s);
  }
  return slots;
};

export const occupancyKey = (
  resourceType: ResourceType,
  resourceId: string,
  date: string,
  slotStartMinutes: number
): string => `${resourceType}#${resourceId}#${date}#${slotStartMinutes}`;

export type OccupancySpec = {
  occupancyKey: string;
  bookingId: string;
  resourceType: ResourceType;
  resourceId: string;
  date: string;
  slotStartMinutes: number;
};

export const buildOccupancySpecs = (args: {
  bookingId: string;
  date: string;
  reservedTime: string;
  durationMinutes: number;
  therapistId?: string | null;
  roomId?: string | null;
}): OccupancySpec[] => {
  const slots = occupiedSlotStarts(args.reservedTime, args.durationMinutes);
  const specs: OccupancySpec[] = [];
  for (const slot of slots) {
    if (args.therapistId) {
      specs.push({
        occupancyKey: occupancyKey("therapist", args.therapistId, args.date, slot),
        bookingId: args.bookingId,
        resourceType: "therapist",
        resourceId: args.therapistId,
        date: args.date,
        slotStartMinutes: slot,
      });
    }
    if (args.roomId) {
      specs.push({
        occupancyKey: occupancyKey("room", args.roomId, args.date, slot),
        bookingId: args.bookingId,
        resourceType: "room",
        resourceId: args.roomId,
        date: args.date,
        slotStartMinutes: slot,
      });
    }
  }
  return specs;
};

/** Worst-case TransactWrite item count for a create/confirm of this duration */
export const estimateConfirmTxItems = (durationMinutes: number): number => {
  const slots = Math.ceil((Number(durationMinutes) || 60) / SLOT_STEP_MINUTES);
  // therapist slots + room slots + Booking put + NotConfirmed update
  return slots * 2 + 2;
};

export const DYNAMODB_TRANSACT_MAX_ITEMS = 100;

export const intervalsOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean => aStart < bEnd && bStart < aEnd;
