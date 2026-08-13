/**
 * Cognito group / staff ownership checks for booking-conflict-guard.
 * Groups already exist in the User Pool — do not recreate via defineAuth.
 */

export const GROUP_ADMIN = "Admin_Confession";
export const GROUP_MINI_ADMIN = "Mini_Admin";
export const GROUP_USERS = "Users";

export type CallerRole = "admin" | "miniAdmin" | "user";

export type Caller = {
  sub: string | null;
  email: string | null;
  username: string | null;
  groups: string[];
  role: CallerRole;
  staffId: string | null;
  staffName: string | null;
};

type IdentityLike = {
  sub?: string;
  username?: string;
  claims?: Record<string, unknown>;
  groups?: string[] | string;
};

const asStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        /* fall through */
      }
    }
    return [trimmed];
  }
  return [];
};

export const resolveRole = (groups: string[]): CallerRole => {
  if (groups.includes(GROUP_ADMIN)) return "admin";
  if (groups.includes(GROUP_MINI_ADMIN)) return "miniAdmin";
  return "user";
};

export const parseCallerIdentity = (
  identity: IdentityLike | null | undefined
): Omit<Caller, "staffId" | "staffName"> => {
  const claims = identity?.claims || {};
  const groups = [
    ...asStringArray(identity?.groups),
    ...asStringArray(claims["cognito:groups"]),
  ];
  const uniqueGroups = [...new Set(groups)];

  const emailClaim = claims.email;
  const usernameClaim = claims["cognito:username"];
  const email =
    (typeof emailClaim === "string" && emailClaim.trim()) ||
    (typeof usernameClaim === "string" && String(usernameClaim).includes("@")
      ? String(usernameClaim).trim()
      : null) ||
    null;

  return {
    sub: identity?.sub || (typeof claims.sub === "string" ? claims.sub : null),
    email: email ? email.toLowerCase() : null,
    username: identity?.username || (typeof usernameClaim === "string" ? usernameClaim : null),
    groups: uniqueGroups,
    role: resolveRole(uniqueGroups),
  };
};

export const unauthorized = (
  message = "You are not allowed to perform this booking action"
) => ({
  ok: false as const,
  errorCode: "UNAUTHORIZED_BOOKING_ACTION" as const,
  message,
  booking: null,
});
