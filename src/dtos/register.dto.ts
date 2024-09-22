export interface RegisterDTO {
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
}
