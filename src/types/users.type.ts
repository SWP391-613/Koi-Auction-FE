import { Role } from "./roles.type";

export type UserDetailsResponse = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  emails: string;
  address: string;
  is_active: number;
  is_subscription: number;
  status_name: string;
  date_of_birth: string | null;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
  created_at: string | null;
  updated_at: string | null;
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

export type UserRegisterDTO = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  address?: string;
  date_of_birth?: string;
  google_account_id?: number;
  status: string;
  role_id: number;
};
