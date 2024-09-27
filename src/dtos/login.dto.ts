export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  refresh_token: string;
}

export type Role = "MEMBER" | "STAFF" | "BREEDER" | "MANAGER";
