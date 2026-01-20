import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";

/**
 * Confession Barcelona - Amplify Gen 2 Backend
 * 
 * This backend provides email-based authentication for staff members.
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const backend = defineBackend({
  auth,
});

