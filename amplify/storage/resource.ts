import { defineStorage } from "@aws-amplify/backend";

/**
 * File storage for room pictures and related assets
 */
export const storage = defineStorage({
  name: "confessionFiles",
  access: (allow) => ({
    "room-pictures/*": [
      allow.groups(["Admin_Confession"]).to(["read", "write", "delete"]),
      allow.authenticated.to(["read"]),
      allow.guest.to(["read"]),
    ],
  }),
});
