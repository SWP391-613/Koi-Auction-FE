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
};

export type PaymentPaginationResponse = {
  item: PaymentResponse[];
  total_page: number;
  total_item: number;
};
