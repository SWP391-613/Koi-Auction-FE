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
  color: string | null;
  order_id: number;
  product_id: number;
  price: number;
  number_of_products: number;
  total_money: number;
};

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
