import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Confession Barcelona - Data Schema
 * 
 * Defines DynamoDB tables for:
 * - Service: massage services with name, duration, price
 * - Cost: expense types with name and optional fixed price
 * - Staff: staff members with name
 * 
 * Access: Admin_Confession group only
 */
const schema = a.schema({
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
