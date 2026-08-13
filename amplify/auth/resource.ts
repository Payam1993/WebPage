import { defineAuth } from "@aws-amplify/backend";

/**
 * Staff auth (email/password).
 *
 * Cognito groups must be declared here for Amplify to create Identity Pool
 * IAM roles used by Storage. AppSync already authorizes via JWT
 * `cognito:groups` (Admin_Confession / Mini_Admin / Users).
 *
 * These group names must match the existing Cognito groups used by the app.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["Admin_Confession", "Mini_Admin", "Users"],
});
