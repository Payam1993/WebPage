import { defineStorage } from "@aws-amplify/backend";

/**
 * File storage for room pictures and related assets.
 *
 * Note: Do not use allow.groups() unless the group is also declared in
 * defineAuth (that creates the Cognito group IAM role). Admin_Confession
 * already exists in Cognito for AppSync rules, so storage uses
 * authenticated/guest roles here. Upload UI remains admin-gated in the app.
 */
export const storage = defineStorage({
  name: "confessionFiles",
  access: (allow) => ({
    "room-pictures/*": [
      allow.authenticated.to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
  }),
});
