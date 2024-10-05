export interface LoginDTO {
  email: string;
  password: string;
}

export type UserLoginResponse = {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  refresh_token: string;
};

export type Role =
  | "ROLE_MEMBER"
  | "ROLE_STAFF"
  | "ROLE_BREEDER"
  | "ROLE_MANAGER";
