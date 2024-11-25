export type Role =
  | "ROLE_MEMBER"
  | "ROLE_STAFF"
  | "ROLE_BREEDER"
  | "ROLE_MANAGER";

export const RoleName = {
  MEMBER: "MEMBER",
  STAFF: "STAFF",
  BREEDER: "BREEDER",
  MANAGER: "MANAGER",
} as const;

export enum UserRole {
  MEMBER = "MEMBER",
  STAFF = "STAFF",
  BREEDER = "BREEDER",
  MANAGER = "MANAGER",
}

// Define the Role type as an interface
export interface RoleModel {
  id: number;
  userRole: UserRole;
}
