import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { bookingConflictGuard } from "../functions/booking-conflict-guard/resource";

/**
 * Confession Barcelona - Data Schema
 * 
 * Defines DynamoDB tables for:
 * - Service: massage service names per center (static data)
 * - Cost: expense types with name and optional fixed price (static data)
 * - Staff: staff members with name (static data)
 * - StaffApplication: public Work With Us applications awaiting admin review
 * - DailyService: daily service records with full details
 * - DailyCost: daily cost records
 * - Booking: client reservations/bookings (staff portal)
 * - BookingOccupancy: race-safe therapist/room slot locks (Lambda-owned)
 * - BusinessKpi: daily target / safe KPI for local payments
 * - NotConfirmedReservation: public booking requests awaiting confirmation
 * - WebsiteHomeImage / WebsiteServiceImage / WebsiteGalleryImage: public site images
 * 
 * Access: 
 * - Admin_Confession group: full access to all models
 * - Authenticated users: access to Booking model (staff portal)
 * - Public (guest): can create NotConfirmedReservation and StaffApplication
 */

const bookingArgs = {
  clientName: a.string(),
  clientPhone: a.string(),
  serviceId: a.string(),
  serviceName: a.string(),
  therapistId: a.string(),
  therapistName: a.string(),
  centerId: a.string(),
  centerName: a.string(),
  roomId: a.string(),
  roomName: a.string(),
  date: a.string(),
  reservedTime: a.string(),
  durationMinutes: a.integer(),
  priceAgreement: a.float(),
  totalPayment: a.float(),
  localPayment: a.float(),
  status: a.string(),
  cancelReason: a.string(),
  paymentStatus: a.string(),
  bookingSource: a.string(),
};

const schema = a.schema({
  // ============================================
  // Static Data Models (Admin only)
  // ============================================
  
  // Service model - massage services (name + center; no duration/price here)
  Service: a
    .model({
      serviceName: a.string().required(),
      // Center this service is offered at
      centerId: a.string(),
      centerName: a.string(),
      // Legacy optional fields (no longer edited in Local Configuration)
      minutes: a.integer(),
      fixedPrice: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]), // Staff can read for dropdowns
      allow.publicApiKey().to(["read"]), // Public can read for booking form (API key auth)
    ]),

  // Cost model - expense categories
  Cost: a
    .model({
      costName: a.string().required(),
      fixedPrice: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]), // Staff can read for dropdowns
    ]),

  // Staff model - staff members (confirmed)
  Staff: a
    .model({
      staffName: a.string().required(),
      lastName: a.string(),
      email: a.string(),
      phone: a.string(),
      gender: a.string(),
      yearsOfExperience: a.string(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated(), // Staff portal can manage confirmed staff
    ]),

  // StaffApplication - public "Work With Us" requests awaiting review
  StaffApplication: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      phone: a.string().required(),
      gender: a.enum(["Man", "Female", "Others"]),
      yearsOfExperience: a.string().required(),
      explanation: a.string(),
      status: a.enum(["Pending", "Confirmed", "Declined"]),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]), // Public can submit applications
      allow.authenticated(), // Staff portal can review, confirm, decline
    ]),

  // Center model - physical locations
  Center: a
    .model({
      centerName: a.string().required(),
      referenceNumber: a.string().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]),
      allow.publicApiKey().to(["read"]), // Public booking form
    ]),

  // Room model - rooms belonging to a center
  Room: a
    .model({
      roomName: a.string().required(),
      referenceNumber: a.string().required(),
      centerId: a.string().required(),
      centerName: a.string(),
      pictureKey: a.string(), // S3 path for room picture
      // Fixed room price; null = custom / depending
      roomPrice: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]),
      allow.publicApiKey().to(["read"]), // Public booking form
    ]),

  // Business KPI — daily local-payment targets (Local Configuration)
  BusinessKpi: a
    .model({
      // Singleton key, typically "default"
      key: a.string().required(),
      // Target total local payments for a day
      dailyTargetKpi: a.float(),
      // Minimum local payments needed to cover costs
      dailySafeKpi: a.float(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.authenticated().to(["read"]),
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

  // Booking model - confirmed client reservations
  Booking: a
    .model({
      // Client information
      clientName: a.string().required(),
      clientPhone: a.string(), // optional for staff-created bookings
      // Service (optional - ID reference and name)
      serviceId: a.string(),
      serviceName: a.string(),
      // Therapist (optional - ID reference or name)
      therapistId: a.string(),
      therapistName: a.string(),
      // Center & Room
      centerId: a.string(),
      centerName: a.string(),
      roomId: a.string(),
      roomName: a.string(),
      // Date and time
      date: a.date().required(),
      reservedTime: a.time().required(),
      durationMinutes: a.integer().required(),
      // Financial
      // Legacy single amount (kept for compatibility; prefer totalPayment / localPayment)
      priceAgreement: a.float().required(),
      // What the client pays (optional for staff Users)
      totalPayment: a.float(),
      // What stays with the local business (required in staff UI)
      localPayment: a.float(),
      // Status: Done | Pending | Canceled
      status: a.enum(["Done", "Pending", "Canceled"]),
      // Reason when status is Canceled
      cancelReason: a.string(),
      // Payment approval by Mini Admin / Admin (set pending when booking is confirmed)
      paymentStatus: a.enum(["None", "PaymentPending", "PaymentApproved"]),
      // How the booking was created: Staff | StaffLink | PublicWeb
      bookingSource: a.enum(["Staff", "StaffLink", "PublicWeb"]),
    })
    .authorization((allow) => [
      // Writes go through booking-conflict-guard Lambda (DynamoDB IAM).
      // Authenticated clients may only read — prevents bypassing guarded mutations.
      allow.authenticated().to(["read"]),
      allow.publicApiKey().to(["read"]), // Public availability calendar (busy slots)
    ]),

  // ============================================
  // Public Booking Requests (Not Confirmed)
  // ============================================

  // NotConfirmedReservation - public booking requests awaiting staff confirmation
  NotConfirmedReservation: a
    .model({
      // Client information
      clientName: a.string().required(),
      clientPhone: a.string().required(),
      // Service
      serviceId: a.string().required(),
      serviceName: a.string().required(),
      // Center & Room
      centerId: a.string(),
      centerName: a.string(),
      roomId: a.string(),
      roomName: a.string(),
      // Optional therapist (staff booking links)
      therapistId: a.string(),
      therapistName: a.string(),
      // Date and time
      date: a.date().required(),
      reservedTime: a.time().required(),
      durationMinutes: a.integer().required(),
      // Status for tracking
      status: a.enum(["NotConfirmed", "Confirmed"]),
      // Set when confirmed via guardedConfirmReservation (idempotent retries)
      confirmedBookingId: a.string(),
      // StaffLink → owning staff confirms; PublicWeb → Mini Admin / Admin confirms
      bookingSource: a.enum(["Staff", "StaffLink", "PublicWeb"]),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create", "read"]), // Public create + availability busy slots
      // Confirmation writes go through booking-conflict-guard (DynamoDB IAM).
      allow.authenticated().to(["read"]),
    ]),

  // ============================================
  // Staff shareable booking links for customers
  // ============================================
  StaffBookingLink: a
    .model({
      token: a.string().required(),
      therapistId: a.string().required(),
      therapistName: a.string().required(),
      centerId: a.string(),
      centerName: a.string(),
      // null roomId = any available room
      roomId: a.string(),
      roomName: a.string(),
      active: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.authenticated(),
      allow.publicApiKey().to(["read"]),
    ]),

  // ============================================
  // Staff Cost Submissions (Pending Admin Confirmation)
  // ============================================

  // NotConfirmedCost - costs submitted by staff awaiting admin confirmation
  NotConfirmedCost: a
    .model({
      // Cost details
      costName: a.string().required(),
      price: a.float().required(),
      date: a.date().required(),
      reason: a.string(),
      // Status for tracking
      status: a.enum(["NotConfirmed", "Confirmed"]),
      // Who submitted it
      submittedBy: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated(), // Staff can create and view their submissions
    ]),

  // ============================================
  // Public website images (Amplify Storage keys)
  // ============================================

  // Homepage named slots (e.g. about-primary, about-secondary)
  WebsiteHomeImage: a
    .model({
      slot: a.string().required(),
      imageKey: a.string().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  // Marketing service card images — serviceId matches src/data/services.js ids
  WebsiteServiceImage: a
    .model({
      serviceId: a.string().required(),
      imageKey: a.string().required(),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  // Homepage gallery strip
  WebsiteGalleryImage: a
    .model({
      imageKey: a.string().required(),
      sortOrder: a.integer().required(),
      active: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.group("Admin_Confession"),
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  // ============================================
  // Race-safe therapist / room slot occupancy (Lambda writes via DynamoDB)
  // Key: therapist|room # resourceId # date # slotStartMinutes
  // ============================================
  BookingOccupancy: a
    .model({
      occupancyKey: a.string().required(),
      bookingId: a.string().required(),
      resourceType: a.string().required(),
      resourceId: a.string().required(),
      date: a.date().required(),
      slotStartMinutes: a.integer().required(),
    })
    .identifier(["occupancyKey"])
    .authorization((allow) => [
      // Infrastructure only: no client writes (create/update/delete).
      // Lambda writes via DynamoDB IAM. Optional Admin read for ops troubleshooting.
      allow.group("Admin_Confession").to(["read"]),
    ]),

  BookingGuardResult: a.customType({
    ok: a.boolean().required(),
    errorCode: a.string(),
    message: a.string(),
    booking: a.json(),
  }),

  guardedCreateBooking: a
    .mutation()
    .arguments(bookingArgs)
    .returns(a.ref("BookingGuardResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(bookingConflictGuard)),

  guardedConfirmReservation: a
    .mutation()
    .arguments({
      notConfirmedId: a.string().required(),
      therapistId: a.string(),
      therapistName: a.string(),
      centerId: a.string(),
      centerName: a.string(),
      roomId: a.string(),
      roomName: a.string(),
      priceAgreement: a.float(),
      totalPayment: a.float(),
      localPayment: a.float(),
      bookingSource: a.string(),
    })
    .returns(a.ref("BookingGuardResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(bookingConflictGuard)),

  guardedUpdateBooking: a
    .mutation()
    .arguments({
      id: a.string().required(),
      ...bookingArgs,
    })
    .returns(a.ref("BookingGuardResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(bookingConflictGuard)),

  guardedCancelBooking: a
    .mutation()
    .arguments({
      id: a.string().required(),
      cancelReason: a.string(),
    })
    .returns(a.ref("BookingGuardResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(bookingConflictGuard)),

  guardedDeleteBooking: a
    .mutation()
    .arguments({
      id: a.string().required(),
    })
    .returns(a.ref("BookingGuardResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(bookingConflictGuard)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
