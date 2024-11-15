import { UserDetailsResponse } from "./users.type";

export enum PaymentStatus {
  ALL = "ALL", // for search
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  REFUNDED = "REFUNDED",
}

export enum PaymentType {
  ORDER = "ORDER",
  DEPOSIT = "DEPOSIT",
  DRAW_OUT = "DRAW_OUT",
}

export enum PaymentMethod {
  CASH = "Cash",
  BANK_TRANSFER = "BANK_TRANSFER",
  VNPAY = "VNPAY",
}

export type PaymentDTO = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
  bank_number: string | null;
  bank_name: string | null;
};

export type PaymentResponse = {
  id: number;
  payment_amount: number;
  payment_date: string | Date;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_id: number | null;
  user: UserDetailsResponse;
  payment_type: PaymentType;
  bank_number: string | null;
  bank_name: string | null;
};

export type PaymentPaginationResponse = {
  item: PaymentResponse[];
  total_page: number;
  total_item: number;
};
