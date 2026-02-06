import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Confession Barcelona - Data Schema
 * 
 * Defines DynamoDB tables for:
 * - Service: massage services with name, duration, price (static data)
 * - Cost: expense types with name and optional fixed price (static data)
 * - Staff: staff members with name (static data)
 * - DailyService: daily service records with full details
 * - DailyCost: daily cost records
 * - Booking: client reservations/bookings
 * 
 * Access: 
 * - Admin_Confession group: full access to all models
 * - Authenticated users: access to Booking model (staff portal)
 */
const schema = a.schema({
  // ============================================
  // Static Data Models (Admin only)
  // ============================================
  
  // Service model - massage services
  Service: a
    .model({
      serviceName: a.string().required(),
      minutes: a.integer(),
      fixedPrice: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]), // Staff can read for dropdowns
    ]),

  // Cost model - expense categories
  Cost: a
    .model({
      costName: a.string().required(),
      fixedPrice: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
    ]),

  // Staff model - staff members
  Staff: a
    .model({
      staffName: a.string().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]), // Staff can read for dropdowns
    ]),

  // ============================================
  // Daily Data Models (Admin only)
  // ============================================

  // DailyService model - daily service records
  DailyService: a
    .model({
      // References to static data (store IDs)
      serviceId: a.string().required(),
      staffId: a.string().required(),
      // Snapshot fields for reporting (denormalized)
      serviceName: a.string().required(),
      staffName: a.string().required(),
      // Financial data
      priceTotal: a.float().required(),
      staffProfit: a.float().required(),
      localBenefit: a.float().required(),
      // Date and time
      date: a.date().required(),
      hourStart: a.time().required(),
      hourFinish: a.time().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
    ]),

  // DailyCost model - daily cost records
  DailyCost: a
    .model({
      // Reference to static data (store ID)
      costId: a.string().required(),
      // Snapshot field for reporting (denormalized)
      costName: a.string().required(),
      // Financial data
      price: a.float().required(),
      // Optional reason/description
      reason: a.string(),
      // Date
      date: a.date().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
    ]),

  // ============================================
  // Booking/Reservation Model (Staff Portal)
  // ============================================

  // Booking model - client reservations
  Booking: a
    .model({
      // Client information
      clientName: a.string().required(),
      clientPhone: a.string().required(),
      // Therapist (optional - ID reference or name)
      therapistId: a.string(),
      therapistName: a.string(),
      // Date and time
      date: a.date().required(),
      reservedTime: a.time().required(),
      durationMinutes: a.integer().required(),
      // Financial
      priceAgreement: a.float().required(),
      // Status: Done | Pending | Canceled
      status: a.enum(["Done", "Pending", "Canceled"]),
    })
    .authorization((allow) => [
      allow.authenticated(), // All authenticated staff can CRUD bookings
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
