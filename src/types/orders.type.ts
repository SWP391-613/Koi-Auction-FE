import { KoiDetailModel } from "./kois.type";
import { UserDetailsResponse } from "./users.type";

export type Order = {
  id: number;
  first_name: string;
  last_name: string;
  total_money: number;
  phone_number: string;
  address: string;
  order_date: string;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  status: string;
  tracking_number: string;
  payment_method: string;
  note: string;
};

export type OrderDetail = {
  id: number;
  order_id: number;
  product_id: KoiDetailModel;
  price: number;
  number_of_products: number;
  total_money: number;
  color?: string;
};

export enum OrderStatus {
  ALL = "ALL",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export type PaymentDTO = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
  bank_number: string | null;
};

export type OrderPaginationResponse = {
  item: OrderResponse[]; //OrderResponse
  total_page: number;
  total_item: number;
};

// Add this type to include the Koi image
export type OrderWithKoiImage = Order & {
  koi_image?: string;
};

export type OrderResponse = {
  id: number;
  user: UserDetailsResponse;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address: string;
  note: string;
  order_date: string | Date;
  status: string;
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string | Date;
  payment_method: string;
  tracking_number: string;
  order_details: OrderDetailResponse[];
};

type OrderDetailResponse = {
  id: number;
  koi: KoiDetailModel;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
};

export type OrderDetailWithKoi = OrderDetail & {
  koi: {
    name: string;
    image_url: string;
    owner_id: number;
  };
};
