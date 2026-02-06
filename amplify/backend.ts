import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/**
 * Confession Barcelona - Amplify Gen 2 Backend
 * 
 * This backend provides:
 * - Email-based authentication for staff members
 * - DynamoDB tables for Services, Costs, and Staff
 * 
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * @see https://docs.amplify.aws/gen2/build-a-backend/data
 */
export const backend = defineBackend({
  auth,
  data,
});
