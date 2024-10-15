import { Role } from "./roles.type";

export type UserBase = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  is_active: number;
  is_subscription: number;
  status_name: UserStatus;
  date_of_birth: string;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  refresh_token: string;
};

export type UserRegisterBase = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address?: string;
  date_of_birth?: string;
  google_account_id?: number;
};

export type UserRegisterDTO = UserRegisterBase & {
  confirm_password: string; // Unique field for UserRegisterDTO
  status: string;
  role_id: number;
};

export type StaffRegisterDTO = Omit<UserRegisterBase, "password"> & {
  password: string;
  phone_number: string;
  is_active?: boolean | number;
  is_subscription?: boolean | number;
  avatar_url?: string;
};

export type Breeder = UserBase;
export type Member = UserBase;
export type Staff = UserBase;

export type UserDetailsResponse = UserBase & {
  created_at: string | null;
  updated_at: string | null;
};

export type UserStatus = "UNVERIFIED" | "VERIFIED" | "BANNED";
