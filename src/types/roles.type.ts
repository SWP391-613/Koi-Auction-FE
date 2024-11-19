export type Role =
  | "ROLE_MEMBER"
  | "ROLE_STAFF"
  | "ROLE_BREEDER"
  | "ROLE_MANAGER";

export const RoleName = {
  MEMBER: "member",
  STAFF: "staff",
  BREEDER: "breeder",
  MANAGER: "manager",
} as const;
