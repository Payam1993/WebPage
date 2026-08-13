import { defineStorage } from "@aws-amplify/backend";

/**
 * File storage (existing confessionFiles → confessionfilesbucket).
 * Do not rename — renaming would create a new bucket.
 *
 * Group-based rules require groups declared in defineAuth (see auth/resource.ts).
 * Important Amplify behavior: users in a Cognito group assume that group's
 * Identity Pool role, so `allow.authenticated` does NOT apply to them.
 * Room-picture access is therefore granted explicitly per staff group.
 *
 * website-images/*:
 * - guests: read (public website)
 * - Admin_Confession only: read / write / delete (backend-enforced)
 */
export const storage = defineStorage({
  name: "confessionFiles",
  access: (allow) => ({
    "room-pictures/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow
        .groups(["Admin_Confession", "Mini_Admin", "Users"])
        .to(["read", "write", "delete"]),
    ],
    "website-images/*": [
      allow.guest.to(["read"]),
      allow.groups(["Admin_Confession"]).to(["read", "write", "delete"]),
    ],
  }),
});
