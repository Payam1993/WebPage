import { defineStorage } from "@aws-amplify/backend";

/**
 * File storage (existing confessionFiles → confessionfilesbucket).
 * Do not rename — renaming would create a new bucket.
 *
 * Cognito groups (Admin_Confession, Mini_Admin, Users) already exist in the
 * production User Pool and are used by AppSync via JWT `cognito:groups`.
 * They are NOT declared in defineAuth: Amplify would try to create them again
 * and fail. Consequently Storage cannot use allow.groups() in this setup —
 * that API requires Amplify-managed group Identity Pool roles.
 *
 * room-pictures/* — unchanged historical access (authenticated R/W/D, guest read).
 *
 * website-images/* — guest read for the public site; write/delete limited to
 * any authenticated staff identity (same IAM model as room pictures). True
 * Admin_Confession-only S3 IAM needs referenceAuth or manual Identity Pool
 * group role mapping (see deployment notes / prior discussion).
 */
export const storage = defineStorage({
  name: "confessionFiles",
  access: (allow) => ({
    "room-pictures/*": [
      allow.authenticated.to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
    "website-images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
