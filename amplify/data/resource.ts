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
 * 
 * Access: Admin_Confession group only
 */
const schema = a.schema({
  // ============================================
  // Static Data Models
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
    ]),

  // ============================================
  // Daily Data Models
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
