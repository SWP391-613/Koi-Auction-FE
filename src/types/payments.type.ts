import { UserDetailsResponse } from "./users.type";

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
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

export type PaymentResponse = {
  id: number;
  payment_amount: number;
  payment_date: [number, number, number, number, number, number, number?];
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_id: number | null;
  user: UserDetailsResponse;
  payment_type: PaymentType;
  bank_number: string | null;
};

export type PaymentPaginationResponse = {
  item: PaymentResponse[];
  total_page: number;
  total_item: number;
};
