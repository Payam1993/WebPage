import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

/**
 * Confession Barcelona - Amplify Gen 2 Backend
 * 
 * This backend provides:
 * - Email-based authentication for staff members
 * - DynamoDB tables for services, costs, staff, centers, rooms, bookings
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
});
