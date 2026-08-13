import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { bookingConflictGuard } from "./functions/booking-conflict-guard/resource";

/**
 * Confession Barcelona - Amplify Gen 2 Backend
 *
 * This backend provides:
 * - Email-based authentication for staff members
 * - DynamoDB tables for services, costs, staff, centers, rooms, bookings
 * - Race-safe booking writes via booking-conflict-guard Lambda
 * - S3 storage for room pictures
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * @see https://docs.amplify.aws/gen2/build-a-backend/data
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  bookingConflictGuard,
});

const bookingTable = backend.data.resources.tables["Booking"];
const occupancyTable = backend.data.resources.tables["BookingOccupancy"];
const notConfirmedTable = backend.data.resources.tables["NotConfirmedReservation"];
const staffTable = backend.data.resources.tables["Staff"];
const guardFn = backend.bookingConflictGuard.resources.lambda;

bookingTable.grantReadWriteData(guardFn);
occupancyTable.grantReadWriteData(guardFn);
notConfirmedTable.grantReadWriteData(guardFn);
staffTable.grantReadData(guardFn);

backend.bookingConflictGuard.addEnvironment(
  "BOOKING_TABLE_NAME",
  bookingTable.tableName
);
backend.bookingConflictGuard.addEnvironment(
  "OCCUPANCY_TABLE_NAME",
  occupancyTable.tableName
);
backend.bookingConflictGuard.addEnvironment(
  "NOT_CONFIRMED_TABLE_NAME",
  notConfirmedTable.tableName
);
backend.bookingConflictGuard.addEnvironment(
  "STAFF_TABLE_NAME",
  staffTable.tableName
);
