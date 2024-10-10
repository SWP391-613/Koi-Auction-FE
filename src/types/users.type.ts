import { Role } from "./roles.type";

export type UserDetailsResponse = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
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

export type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  status_name: string;
  date_of_birth: string;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
};

export type StaffsResponse = {
  total_page: number;
  total_item: number;
  item: Staff[];
};

export type Member = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  status_name: string;
  date_of_birth: number;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
};

export type MembersResponse = {
  total_page: number;
  total_item: number;
  item: Member[];
};

export type Breeder = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  status_name: string;
  date_of_birth: number;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
};

export type BreedersResponse = {
  total_page: number;
  total_item: number;
  item: Breeder[];
};
