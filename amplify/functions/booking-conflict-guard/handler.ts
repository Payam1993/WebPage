import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  TransactWriteCommand,
  type GetCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import {
  parseCallerIdentity,
  unauthorized,
  type Caller,
} from "./auth";
import {
  buildOccupancySpecs,
  DYNAMODB_TRANSACT_MAX_ITEMS,
  estimateConfirmTxItems,
  intervalsOverlap,
  normalizeTime,
  timeToMinutes,
  validateTimeGrid,
  type OccupancySpec,
} from "./occupancy";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

type GuardResult = {
  ok: boolean;
  errorCode?: string | null;
  message?: string | null;
  booking?: Record<string, unknown> | null;
};

type BookingRecord = {
  id: string;
  clientName: string;
  clientPhone?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  therapistId?: string | null;
  therapistName?: string | null;
  centerId?: string | null;
  centerName?: string | null;
  roomId?: string | null;
  roomName?: string | null;
  date: string;
  reservedTime: string;
  durationMinutes: number;
  priceAgreement: number;
  totalPayment?: number | null;
  localPayment?: number | null;
  status?: string | null;
  cancelReason?: string | null;
  paymentStatus?: string | null;
  bookingSource?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __typename?: string;
};

type StaffRecord = {
  id: string;
  staffName?: string;
  lastName?: string;
  email?: string | null;
};

const env = (key: string): string => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env ${key}`);
  return v;
};

const nowIso = () => new Date().toISOString();

const fail = (errorCode: string, message: string): GuardResult => ({
  ok: false,
  errorCode,
  message,
  booking: null,
});

const ok = (booking: Record<string, unknown>): GuardResult => ({
  ok: true,
  errorCode: null,
  message: null,
  booking,
});

const validateRequired = (args: {
  therapistId?: string | null;
  roomId?: string | null;
  date?: string | null;
  reservedTime?: string | null;
  durationMinutes?: number | null;
}): GuardResult | null => {
  if (!args.therapistId) return fail("THERAPIST_REQUIRED", "Therapist is required");
  if (!args.roomId) return fail("ROOM_REQUIRED", "Room is required");
  if (!args.date || !args.reservedTime) {
    return fail("INVALID_TIME", "Valid date and time are required");
  }
  const grid = validateTimeGrid(args.reservedTime, args.durationMinutes);
  if (!grid.ok) return fail("INVALID_TIME", grid.message);
  if (estimateConfirmTxItems(Number(args.durationMinutes) || 60) > DYNAMODB_TRANSACT_MAX_ITEMS) {
    return fail("INVALID_TIME", "Duration is too long for a single reservation write");
  }
  return null;
};

const occupancyItem = (spec: OccupancySpec) => {
  const ts = nowIso();
  return {
    occupancyKey: spec.occupancyKey,
    bookingId: spec.bookingId,
    resourceType: spec.resourceType,
    resourceId: spec.resourceId,
    date: spec.date,
    slotStartMinutes: spec.slotStartMinutes,
    createdAt: ts,
    updatedAt: ts,
    __typename: "BookingOccupancy",
  };
};

/** Claim slot if free OR already owned by this booking (idempotent / reschedule-safe). */
const putOccupancyTx = (spec: OccupancySpec) => ({
  Put: {
    TableName: env("OCCUPANCY_TABLE_NAME"),
    Item: occupancyItem(spec),
    ConditionExpression:
      "attribute_not_exists(occupancyKey) OR bookingId = :bid",
    ExpressionAttributeValues: { ":bid": spec.bookingId },
  },
});

const deleteOccupancyTx = (key: string) => ({
  Delete: {
    TableName: env("OCCUPANCY_TABLE_NAME"),
    Key: { occupancyKey: key },
  },
});

async function getBooking(id: string): Promise<BookingRecord | null> {
  const res = await ddb.send(
    new GetCommand({
      TableName: env("BOOKING_TABLE_NAME"),
      Key: { id },
    })
  );
  return (res.Item as BookingRecord) || null;
}

async function getNotConfirmed(id: string): Promise<Record<string, unknown> | null> {
  const res = await ddb.send(
    new GetCommand({
      TableName: env("NOT_CONFIRMED_TABLE_NAME"),
      Key: { id },
    })
  );
  return (res.Item as Record<string, unknown>) || null;
}

async function findStaffByEmail(email: string | null): Promise<StaffRecord | { error: GuardResult }> {
  if (!email) {
    return {
      error: unauthorized("No staff profile is linked to your account"),
    };
  }
  const normalized = email.trim().toLowerCase();
  const matches: StaffRecord[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: env("STAFF_TABLE_NAME"),
        ExclusiveStartKey,
      })
    );
    for (const item of res.Items || []) {
      const staff = item as StaffRecord;
      if (staff.email?.trim().toLowerCase() === normalized) {
        matches.push(staff);
      }
    }
    ExclusiveStartKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);

  if (matches.length === 0) {
    return {
      error: unauthorized("No staff profile is linked to your account"),
    };
  }
  if (matches.length > 1) {
    console.error("Duplicate Staff email mapping", normalized, matches.map((m) => m.id));
    return {
      error: unauthorized("Staff identity mapping is ambiguous — contact Admin"),
    };
  }
  return matches[0];
}

async function resolveCaller(identity: unknown): Promise<Caller | GuardResult> {
  const base = parseCallerIdentity(identity as Parameters<typeof parseCallerIdentity>[0]);
  if (!base.sub && !base.email && !base.username) {
    return unauthorized("Authentication required");
  }

  // Admin / Mini Admin may operate without a Staff row (confirm/payment flows).
  // Users must have exactly one Staff mapping — fail closed otherwise.
  if (!base.email) {
    if (base.role === "admin" || base.role === "miniAdmin") {
      return { ...base, staffId: null, staffName: null };
    }
    return unauthorized("Authenticated email is required");
  }

  const staffOrErr = await findStaffByEmail(base.email);
  if ("error" in staffOrErr) {
    if (base.role === "admin" || base.role === "miniAdmin") {
      // Admins without Staff profile can still confirm/approve; Users cannot.
      return { ...base, staffId: null, staffName: null };
    }
    return staffOrErr.error;
  }

  const staff = staffOrErr;
  return {
    ...base,
    staffId: staff.id,
    staffName: [staff.staffName, staff.lastName].filter(Boolean).join(" ") || null,
  };
}

function assertCanCreate(caller: Caller, therapistId: string): GuardResult | null {
  if (caller.role === "admin") return null;
  if (caller.role === "miniAdmin") {
    return unauthorized("Mini Admin cannot create staff bookings directly");
  }
  if (!caller.staffId) {
    return unauthorized("No staff profile is linked to your account");
  }
  if (therapistId !== caller.staffId) {
    return unauthorized("You can only create bookings assigned to yourself");
  }
  return null;
}

function resolveRequestSource(pending: Record<string, unknown>): "PublicWeb" | "StaffLink" | "Staff" {
  const raw = pending.bookingSource as string | undefined;
  if (raw === "Staff" || raw === "StaffLink" || raw === "PublicWeb") return raw;
  if (pending.therapistId) return "StaffLink";
  return "PublicWeb";
}

function assertCanConfirm(caller: Caller, pending: Record<string, unknown>): GuardResult | null {
  const source = resolveRequestSource(pending);
  if (source === "PublicWeb") {
    if (caller.role === "admin" || caller.role === "miniAdmin") return null;
    return unauthorized("Only Admin or Mini Admin can confirm public website requests");
  }
  if (source === "StaffLink") {
    if (caller.role === "admin") return null;
    const ownerId = pending.therapistId as string | undefined;
    if (caller.role === "user" && caller.staffId && ownerId && caller.staffId === ownerId) {
      return null;
    }
    return unauthorized("Only the owning staff member (or Admin) can confirm this StaffLink request");
  }
  if (caller.role === "admin" || caller.role === "miniAdmin") return null;
  return unauthorized("You are not allowed to confirm this reservation");
}

/** Existing Todo UI: Admin + Mini Admin + owning User may cancel. */
function assertCanCancel(caller: Caller, booking: BookingRecord): GuardResult | null {
  if (caller.role === "admin" || caller.role === "miniAdmin") return null;
  if (!caller.staffId) {
    return unauthorized("No staff profile is linked to your account");
  }
  if (booking.therapistId && booking.therapistId === caller.staffId) return null;
  return unauthorized("You can only cancel your own bookings");
}

/** Hard delete is Reservations-only (Admin/User UI) — not Mini Admin. */
function assertCanDelete(caller: Caller, booking: BookingRecord): GuardResult | null {
  if (caller.role === "admin") return null;
  if (caller.role === "miniAdmin") {
    return unauthorized("Mini Admin cannot delete bookings");
  }
  if (!caller.staffId) {
    return unauthorized("No staff profile is linked to your account");
  }
  if (booking.therapistId && booking.therapistId === caller.staffId) return null;
  return unauthorized("You can only delete your own bookings");
}

/**
 * Mini Admin updates are limited to existing operational actions:
 * - approve payment (paymentStatus → PaymentApproved)
 * - confirm service done (Pending → Done)
 * No schedule/therapist/room reassignment.
 */
function assertCanUpdate(
  caller: Caller,
  existing: BookingRecord,
  merged: BookingRecord,
  scheduleTouched: boolean
): GuardResult | null {
  if (caller.role === "admin") return null;

  if (caller.role === "miniAdmin") {
    if (scheduleTouched) {
      return unauthorized("Mini Admin cannot reschedule or reassign bookings");
    }
    const statusSame = merged.status === existing.status;
    const serviceDone =
      existing.status === "Pending" && merged.status === "Done";
    const paymentApprove =
      merged.paymentStatus === "PaymentApproved" &&
      existing.paymentStatus !== "PaymentApproved";
    const paymentUnchanged = merged.paymentStatus === existing.paymentStatus;

    if (serviceDone && (paymentUnchanged || paymentApprove || merged.paymentStatus === "PaymentPending")) {
      return null;
    }
    if (statusSame && paymentApprove) {
      return null;
    }
    // Allow no-op / same payment refresh if nothing restricted changed
    if (statusSame && paymentUnchanged) {
      return null;
    }
    return unauthorized(
      "Mini Admin may only approve payments or confirm completed services"
    );
  }

  // Normal Users: own bookings only; cannot spoof another therapistId
  if (!caller.staffId) {
    return unauthorized("No staff profile is linked to your account");
  }
  if (!existing.therapistId || existing.therapistId !== caller.staffId) {
    return unauthorized("You can only manage your own bookings");
  }
  if (merged.therapistId && merged.therapistId !== caller.staffId) {
    return unauthorized("You cannot assign a booking to another therapist");
  }
  return null;
}

async function batchGetOccupancy(
  keys: string[]
): Promise<Map<string, { bookingId?: string; resourceType?: string }>> {
  const map = new Map<string, { bookingId?: string; resourceType?: string }>();
  const unique = [...new Set(keys)];
  const chunk = 25;
  for (let i = 0; i < unique.length; i += chunk) {
    const slice = unique.slice(i, i + chunk);
    const results: GetCommandOutput[] = await Promise.all(
      slice.map((occupancyKey) =>
        ddb.send(
          new GetCommand({
            TableName: env("OCCUPANCY_TABLE_NAME"),
            Key: { occupancyKey },
          })
        )
      )
    );
    results.forEach((r: GetCommandOutput, idx: number) => {
      if (r.Item) {
        map.set(slice[idx], {
          bookingId: r.Item.bookingId as string | undefined,
          resourceType: r.Item.resourceType as string | undefined,
        });
      }
    });
  }
  return map;
}

/**
 * Bounded historical backfill OUTSIDE the final transaction.
 * Only fills occupancy for bookings that overlap the candidate window
 * (same therapist and/or room, or unassigned-room blockers) — not the whole day.
 * Each Put uses attribute_not_exists → idempotent under concurrency.
 */
async function ensureOverlappingHistoricalOccupancy(
  candidate: {
    therapistId: string;
    roomId: string;
    date: string;
    reservedTime: string;
    durationMinutes: number;
  },
  dayBookings: BookingRecord[],
  excludeBookingId?: string | null
) {
  const start = timeToMinutes(candidate.reservedTime);
  const end = start + (Number(candidate.durationMinutes) || 60);

  const relevant = dayBookings.filter((b) => {
    if (!b?.id || b.id === excludeBookingId) return false;
    if (b.status === "Canceled") return false;
    if (b.date !== candidate.date) return false;
    const bStart = timeToMinutes(b.reservedTime);
    const bEnd = bStart + (Number(b.durationMinutes) || 60);
    if (!intervalsOverlap(start, end, bStart, bEnd)) return false;
    if (b.therapistId && b.therapistId === candidate.therapistId) return true;
    if (b.roomId && b.roomId === candidate.roomId) return true;
    if (!b.roomId) return true; // unassigned room blocks all rooms
    return false;
  });

  for (const b of relevant) {
    if (!b.therapistId && !b.roomId) continue;
    // Skip non-grid historical rows for occupancy keys; Booking-table overlap still blocks them
    const grid = validateTimeGrid(b.reservedTime, b.durationMinutes);
    if (!grid.ok) continue;

    const specs = buildOccupancySpecs({
      bookingId: b.id,
      date: b.date,
      reservedTime: b.reservedTime,
      durationMinutes: Number(b.durationMinutes) || 60,
      therapistId: b.therapistId,
      roomId: b.roomId,
    });
    for (const spec of specs) {
      try {
        await ddb.send(
          new PutCommand({
            TableName: env("OCCUPANCY_TABLE_NAME"),
            Item: occupancyItem(spec),
            ConditionExpression: "attribute_not_exists(occupancyKey)",
          })
        );
      } catch (err: unknown) {
        const name = (err as { name?: string })?.name;
        if (name !== "ConditionalCheckFailedException") throw err;
        // Already owned by someone — conflict detection reads it next
      }
    }
  }
}

function classifyExistingConflict(
  specs: OccupancySpec[],
  existing: Map<string, { bookingId?: string; resourceType?: string }>,
  selfBookingId?: string | null
): GuardResult | null {
  for (const spec of specs) {
    const hit = existing.get(spec.occupancyKey);
    if (!hit) continue;
    // Same booking already owns this slot — not a conflict (reschedule / retry)
    if (selfBookingId && hit.bookingId === selfBookingId) continue;
    if (spec.resourceType === "therapist" || hit.resourceType === "therapist") {
      return fail("THERAPIST_CONFLICT", "Therapist is already booked for this time");
    }
    return fail("ROOM_CONFLICT", "Room is already reserved for this time");
  }
  return null;
}

function classifyBookingTableConflict(
  dayBookings: BookingRecord[],
  candidate: {
    therapistId: string;
    roomId: string;
    date: string;
    reservedTime: string;
    durationMinutes: number;
  },
  excludeBookingId?: string | null
): GuardResult | null {
  const start = timeToMinutes(candidate.reservedTime);
  const end = start + (Number(candidate.durationMinutes) || 60);
  for (const b of dayBookings) {
    if (!b?.id || b.id === excludeBookingId) continue;
    if (b.status === "Canceled") continue;
    if (b.date !== candidate.date) continue;
    const bStart = timeToMinutes(b.reservedTime);
    const bEnd = bStart + (Number(b.durationMinutes) || 60);
    if (!intervalsOverlap(start, end, bStart, bEnd)) continue;
    if (b.therapistId && b.therapistId === candidate.therapistId) {
      return fail("THERAPIST_CONFLICT", "Therapist is already booked for this time");
    }
    if (b.roomId && b.roomId === candidate.roomId) {
      return fail("ROOM_CONFLICT", "Room is already reserved for this time");
    }
    if (!b.roomId) {
      return fail(
        "ROOM_CONFLICT",
        "An unassigned reservation already covers this time"
      );
    }
  }
  return null;
}

async function listDayBookings(date: string): Promise<BookingRecord[]> {
  const bookings: BookingRecord[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: env("BOOKING_TABLE_NAME"),
        FilterExpression: "#d = :date",
        ExpressionAttributeNames: { "#d": "date" },
        ExpressionAttributeValues: { ":date": date },
        ExclusiveStartKey,
      })
    );
    for (const item of res.Items || []) bookings.push(item as BookingRecord);
    ExclusiveStartKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);
  return bookings;
}

async function precheckConflicts(args: {
  bookingId: string;
  therapistId: string;
  roomId: string;
  date: string;
  reservedTime: string;
  durationMinutes: number;
  excludeBookingId?: string | null;
}): Promise<GuardResult | null> {
  const day = await listDayBookings(args.date);
  // Bounded backfill outside the transaction (overlapping peers only)
  await ensureOverlappingHistoricalOccupancy(args, day, args.excludeBookingId);

  const specs = buildOccupancySpecs(args);
  const existing = await batchGetOccupancy(specs.map((s) => s.occupancyKey));
  const fromOcc = classifyExistingConflict(specs, existing, args.excludeBookingId);
  if (fromOcc) return fromOcc;
  return classifyBookingTableConflict(day, args, args.excludeBookingId);
}

function isTransactionConflict(err: unknown): boolean {
  const e = err as { name?: string; CancellationReasons?: Array<{ Code?: string }> };
  if (e?.name === "TransactionCanceledException") {
    return (e.CancellationReasons || []).some(
      (r) => r.Code === "ConditionalCheckFailed"
    );
  }
  return false;
}

async function reclassifyAfterTxFail(specs: OccupancySpec[], selfId?: string | null) {
  const existing = await batchGetOccupancy(specs.map((s) => s.occupancyKey));
  return (
    classifyExistingConflict(specs, existing, selfId) ||
    fail("THERAPIST_CONFLICT", "Booking conflict — please choose another time")
  );
}

function buildBookingItem(
  id: string,
  args: Record<string, unknown>,
  existing?: BookingRecord | null
): BookingRecord {
  const ts = nowIso();
  const reservedTime = normalizeTime(String(args.reservedTime || existing?.reservedTime || ""));
  return {
    id,
    clientName: String(args.clientName ?? existing?.clientName ?? ""),
    clientPhone: (args.clientPhone as string | null | undefined) ?? existing?.clientPhone ?? null,
    serviceId: (args.serviceId as string | null | undefined) ?? existing?.serviceId ?? null,
    serviceName: (args.serviceName as string | null | undefined) ?? existing?.serviceName ?? null,
    therapistId: (args.therapistId as string | null | undefined) ?? existing?.therapistId ?? null,
    therapistName:
      (args.therapistName as string | null | undefined) ?? existing?.therapistName ?? null,
    centerId: (args.centerId as string | null | undefined) ?? existing?.centerId ?? null,
    centerName: (args.centerName as string | null | undefined) ?? existing?.centerName ?? null,
    roomId: (args.roomId as string | null | undefined) ?? existing?.roomId ?? null,
    roomName: (args.roomName as string | null | undefined) ?? existing?.roomName ?? null,
    date: String(args.date ?? existing?.date ?? ""),
    reservedTime,
    durationMinutes: Number(args.durationMinutes ?? existing?.durationMinutes ?? 60),
    priceAgreement: Number(args.priceAgreement ?? existing?.priceAgreement ?? 0),
    totalPayment:
      args.totalPayment === undefined
        ? existing?.totalPayment ?? null
        : (args.totalPayment as number | null),
    localPayment:
      args.localPayment === undefined
        ? existing?.localPayment ?? null
        : (args.localPayment as number | null),
    status: String(args.status ?? existing?.status ?? "Pending"),
    cancelReason:
      (args.cancelReason as string | null | undefined) ?? existing?.cancelReason ?? null,
    paymentStatus: String(args.paymentStatus ?? existing?.paymentStatus ?? "PaymentPending"),
    bookingSource:
      (args.bookingSource as string | null | undefined) ?? existing?.bookingSource ?? "Staff",
    createdAt: existing?.createdAt || ts,
    updatedAt: ts,
    __typename: "Booking",
  };
}

async function createBooking(
  args: Record<string, unknown>,
  caller: Caller
): Promise<GuardResult> {
  const required = validateRequired({
    therapistId: args.therapistId as string,
    roomId: args.roomId as string,
    date: args.date as string,
    reservedTime: args.reservedTime as string,
    durationMinutes: args.durationMinutes as number,
  });
  if (required) return required;
  if (!args.clientName) return fail("INVALID_TIME", "Client name is required");

  const authErr = assertCanCreate(caller, String(args.therapistId));
  if (authErr) return authErr;

  const id = crypto.randomUUID();
  const booking = buildBookingItem(id, {
    ...args,
    status: args.status || "Pending",
    bookingSource: args.bookingSource || "Staff",
  });
  const specs = buildOccupancySpecs({
    bookingId: id,
    date: booking.date,
    reservedTime: booking.reservedTime,
    durationMinutes: booking.durationMinutes,
    therapistId: booking.therapistId,
    roomId: booking.roomId,
  });

  if (1 + specs.length > DYNAMODB_TRANSACT_MAX_ITEMS) {
    return fail("INVALID_TIME", "Duration is too long for a single reservation write");
  }

  const conflict = await precheckConflicts({
    bookingId: id,
    therapistId: booking.therapistId!,
    roomId: booking.roomId!,
    date: booking.date,
    reservedTime: booking.reservedTime,
    durationMinutes: booking.durationMinutes,
  });
  if (conflict) return conflict;

  try {
    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: env("BOOKING_TABLE_NAME"),
              Item: booking,
              ConditionExpression: "attribute_not_exists(id)",
            },
          },
          ...specs.map(putOccupancyTx),
        ],
      })
    );
  } catch (err) {
    if (isTransactionConflict(err)) return reclassifyAfterTxFail(specs);
    throw err;
  }
  return ok(booking as unknown as Record<string, unknown>);
}

async function returnExistingConfirmation(
  pending: Record<string, unknown>
): Promise<GuardResult> {
  const bookingId = pending.confirmedBookingId as string | undefined;
  if (bookingId) {
    const existing = await getBooking(bookingId);
    if (existing) return ok(existing as unknown as Record<string, unknown>);
  }
  return fail(
    "ALREADY_CONFIRMED",
    "This reservation request was already confirmed"
  );
}

async function confirmReservation(
  args: Record<string, unknown>,
  caller: Caller
): Promise<GuardResult> {
  const notConfirmedId = String(args.notConfirmedId || "");
  if (!notConfirmedId) return fail("INVALID_TIME", "Reservation id is required");

  const pending = await getNotConfirmed(notConfirmedId);
  if (!pending) {
    return fail(
      "ALREADY_CONFIRMED",
      "This reservation request was already confirmed or removed"
    );
  }

  if (pending.status === "Confirmed") {
    return returnExistingConfirmation(pending);
  }

  const authErr = assertCanConfirm(caller, pending);
  if (authErr) return authErr;

  const therapistId = (args.therapistId as string) || (pending.therapistId as string) || null;
  const roomId = (args.roomId as string) || (pending.roomId as string) || null;
  const required = validateRequired({
    therapistId,
    roomId,
    date: pending.date as string,
    reservedTime: pending.reservedTime as string,
    durationMinutes: pending.durationMinutes as number,
  });
  if (required) return required;

  // StaffLink owner confirm: therapist must remain the owning staff (Users cannot reassign)
  const source = resolveRequestSource(pending);
  if (source === "StaffLink" && caller.role === "user") {
    if (therapistId !== caller.staffId) {
      return unauthorized("StaffLink confirmations must stay assigned to you");
    }
  }

  const id = crypto.randomUUID();
  const booking = buildBookingItem(id, {
    clientName: pending.clientName,
    clientPhone: pending.clientPhone,
    serviceId: pending.serviceId,
    serviceName: pending.serviceName,
    therapistId,
    therapistName: args.therapistName ?? pending.therapistName,
    centerId: args.centerId ?? pending.centerId,
    centerName: args.centerName ?? pending.centerName,
    roomId,
    roomName: args.roomName ?? pending.roomName,
    date: pending.date,
    reservedTime: pending.reservedTime,
    durationMinutes: pending.durationMinutes,
    priceAgreement: args.priceAgreement ?? 0,
    totalPayment: args.totalPayment ?? null,
    localPayment: args.localPayment ?? args.priceAgreement ?? null,
    status: "Pending",
    paymentStatus: "PaymentPending",
    bookingSource: args.bookingSource ?? source,
  });

  const specs = buildOccupancySpecs({
    bookingId: id,
    date: booking.date,
    reservedTime: booking.reservedTime,
    durationMinutes: booking.durationMinutes,
    therapistId: booking.therapistId,
    roomId: booking.roomId,
  });

  if (2 + specs.length > DYNAMODB_TRANSACT_MAX_ITEMS) {
    return fail("INVALID_TIME", "Duration is too long for a single reservation write");
  }

  const conflict = await precheckConflicts({
    bookingId: id,
    therapistId: booking.therapistId!,
    roomId: booking.roomId!,
    date: booking.date,
    reservedTime: booking.reservedTime,
    durationMinutes: booking.durationMinutes,
  });
  if (conflict) return conflict;

  const ts = nowIso();
  try {
    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: env("BOOKING_TABLE_NAME"),
              Item: booking,
              ConditionExpression: "attribute_not_exists(id)",
            },
          },
          ...specs.map(putOccupancyTx),
          {
            Update: {
              TableName: env("NOT_CONFIRMED_TABLE_NAME"),
              Key: { id: notConfirmedId },
              UpdateExpression:
                "SET #s = :confirmed, confirmedBookingId = :bid, updatedAt = :ts",
              ConditionExpression: "attribute_exists(id) AND #s = :notConfirmed",
              ExpressionAttributeNames: { "#s": "status" },
              ExpressionAttributeValues: {
                ":confirmed": "Confirmed",
                ":notConfirmed": "NotConfirmed",
                ":bid": id,
                ":ts": ts,
              },
            },
          },
        ],
      })
    );
  } catch (err) {
    if (isTransactionConflict(err)) {
      // Double-click / retry: peer may have already confirmed this request
      const again = await getNotConfirmed(notConfirmedId);
      if (again?.status === "Confirmed") {
        return returnExistingConfirmation(again);
      }
      return reclassifyAfterTxFail(specs);
    }
    throw err;
  }
  return ok(booking as unknown as Record<string, unknown>);
}

async function updateBooking(
  args: Record<string, unknown>,
  caller: Caller
): Promise<GuardResult> {
  const id = String(args.id || "");
  if (!id) return fail("INVALID_TIME", "Booking id is required");
  const existing = await getBooking(id);
  if (!existing) return fail("INVALID_TIME", "Booking not found");

  const nextStatus = String(args.status ?? existing.status ?? "Pending");
  if (nextStatus === "Canceled") {
    return cancelBooking({ id, cancelReason: args.cancelReason }, caller);
  }

  const merged = buildBookingItem(id, args, existing);
  const scheduleTouched =
    merged.date !== existing.date ||
    normalizeTime(merged.reservedTime) !== normalizeTime(existing.reservedTime) ||
    Number(merged.durationMinutes) !== Number(existing.durationMinutes) ||
    merged.therapistId !== existing.therapistId ||
    merged.roomId !== existing.roomId;

  const authErr = assertCanUpdate(caller, existing, merged, scheduleTouched);
  if (authErr) return authErr;

  if (scheduleTouched) {
    const required = validateRequired({
      therapistId: merged.therapistId,
      roomId: merged.roomId,
      date: merged.date,
      reservedTime: merged.reservedTime,
      durationMinutes: merged.durationMinutes,
    });
    if (required) return required;
  }

  if (!scheduleTouched) {
    const ts = nowIso();
    const item = { ...merged, updatedAt: ts };
    await ddb.send(
      new PutCommand({
        TableName: env("BOOKING_TABLE_NAME"),
        Item: item,
        ConditionExpression: "attribute_exists(id)",
      })
    );
    return ok(item as unknown as Record<string, unknown>);
  }

  const oldSpecs = buildOccupancySpecs({
    bookingId: id,
    date: existing.date,
    reservedTime: existing.reservedTime,
    durationMinutes: Number(existing.durationMinutes) || 60,
    therapistId: existing.therapistId,
    roomId: existing.roomId,
  });
  const newSpecs = buildOccupancySpecs({
    bookingId: id,
    date: merged.date,
    reservedTime: merged.reservedTime,
    durationMinutes: merged.durationMinutes,
    therapistId: merged.therapistId,
    roomId: merged.roomId,
  });

  const oldKeySet = new Set(oldSpecs.map((s) => s.occupancyKey));
  const newKeySet = new Set(newSpecs.map((s) => s.occupancyKey));
  const toDelete = oldSpecs.filter((s) => !newKeySet.has(s.occupancyKey));
  const toPut = newSpecs.filter((s) => !oldKeySet.has(s.occupancyKey));

  if (1 + toDelete.length + toPut.length > DYNAMODB_TRANSACT_MAX_ITEMS) {
    return fail("INVALID_TIME", "Duration is too long for a single reservation write");
  }

  const conflict = await precheckConflicts({
    bookingId: id,
    therapistId: merged.therapistId!,
    roomId: merged.roomId!,
    date: merged.date,
    reservedTime: merged.reservedTime,
    durationMinutes: merged.durationMinutes,
    excludeBookingId: id,
  });
  if (conflict) return conflict;

  try {
    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: env("BOOKING_TABLE_NAME"),
              Item: merged,
              ConditionExpression: "attribute_exists(id)",
            },
          },
          ...toDelete.map((s) => deleteOccupancyTx(s.occupancyKey)),
          ...toPut.map(putOccupancyTx),
        ],
      })
    );
  } catch (err) {
    if (isTransactionConflict(err)) return reclassifyAfterTxFail(newSpecs, id);
    throw err;
  }
  return ok(merged as unknown as Record<string, unknown>);
}

async function cancelBooking(
  args: Record<string, unknown>,
  caller: Caller
): Promise<GuardResult> {
  const id = String(args.id || "");
  if (!id) return fail("INVALID_TIME", "Booking id is required");
  const existing = await getBooking(id);
  if (!existing) return fail("INVALID_TIME", "Booking not found");

  const authErr = assertCanCancel(caller, existing);
  if (authErr) return authErr;

  const specs = buildOccupancySpecs({
    bookingId: id,
    date: existing.date,
    reservedTime: existing.reservedTime,
    durationMinutes: Number(existing.durationMinutes) || 60,
    therapistId: existing.therapistId,
    roomId: existing.roomId,
  });

  const canceled = buildBookingItem(
    id,
    {
      status: "Canceled",
      cancelReason: args.cancelReason ?? existing.cancelReason ?? null,
    },
    existing
  );

  const txItems = [
    {
      Put: {
        TableName: env("BOOKING_TABLE_NAME"),
        Item: canceled,
        ConditionExpression: "attribute_exists(id)",
      },
    },
    ...specs.map((s) => deleteOccupancyTx(s.occupancyKey)),
  ];

  if (txItems.length <= DYNAMODB_TRANSACT_MAX_ITEMS) {
    await ddb.send(new TransactWriteCommand({ TransactItems: txItems }));
  } else {
    await ddb.send(
      new PutCommand({
        TableName: env("BOOKING_TABLE_NAME"),
        Item: canceled,
        ConditionExpression: "attribute_exists(id)",
      })
    );
    await Promise.all(
      specs.map((s) =>
        ddb.send(
          new DeleteCommand({
            TableName: env("OCCUPANCY_TABLE_NAME"),
            Key: { occupancyKey: s.occupancyKey },
          })
        )
      )
    );
  }
  return ok(canceled as unknown as Record<string, unknown>);
}

async function deleteBooking(
  args: Record<string, unknown>,
  caller: Caller
): Promise<GuardResult> {
  const id = String(args.id || "");
  if (!id) return fail("INVALID_TIME", "Booking id is required");
  const existing = await getBooking(id);
  if (!existing) return ok({ id });

  const authErr = assertCanDelete(caller, existing);
  if (authErr) return authErr;

  const specs = buildOccupancySpecs({
    bookingId: id,
    date: existing.date,
    reservedTime: existing.reservedTime,
    durationMinutes: Number(existing.durationMinutes) || 60,
    therapistId: existing.therapistId,
    roomId: existing.roomId,
  });

  const txItems = [
    {
      Delete: {
        TableName: env("BOOKING_TABLE_NAME"),
        Key: { id },
      },
    },
    ...specs.map((s) => deleteOccupancyTx(s.occupancyKey)),
  ];

  if (txItems.length <= DYNAMODB_TRANSACT_MAX_ITEMS) {
    await ddb.send(new TransactWriteCommand({ TransactItems: txItems }));
  } else {
    await ddb.send(
      new DeleteCommand({
        TableName: env("BOOKING_TABLE_NAME"),
        Key: { id },
      })
    );
    await Promise.all(
      specs.map((s) =>
        ddb.send(
          new DeleteCommand({
            TableName: env("OCCUPANCY_TABLE_NAME"),
            Key: { occupancyKey: s.occupancyKey },
          })
        )
      )
    );
  }
  return ok({ id });
}

export const handler = async (event: {
  info?: { fieldName?: string };
  fieldName?: string;
  arguments: Record<string, unknown>;
  identity?: unknown;
}): Promise<GuardResult> => {
  const field = event.info?.fieldName || event.fieldName || "";
  try {
    const callerOrErr = await resolveCaller(event.identity);
    if ("ok" in callerOrErr && callerOrErr.ok === false) {
      return callerOrErr;
    }
    const caller = callerOrErr as Caller;

    switch (field) {
      case "guardedCreateBooking":
        return await createBooking(event.arguments, caller);
      case "guardedConfirmReservation":
        return await confirmReservation(event.arguments, caller);
      case "guardedUpdateBooking":
        return await updateBooking(event.arguments, caller);
      case "guardedCancelBooking":
        return await cancelBooking(event.arguments, caller);
      case "guardedDeleteBooking":
        return await deleteBooking(event.arguments, caller);
      default:
        return fail("INVALID_TIME", `Unknown operation: ${field}`);
    }
  } catch (err) {
    console.error("booking-conflict-guard error", field, err);
    return fail("INVALID_TIME", "Booking operation failed. Please try again.");
  }
};
