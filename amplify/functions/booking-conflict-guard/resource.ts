import { defineFunction } from "@aws-amplify/backend";

/**
 * Server-side booking writes with race-safe therapist/room occupancy locks.
 */
export const bookingConflictGuard = defineFunction({
  name: "booking-conflict-guard",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 30,
  memoryMB: 256,
});
