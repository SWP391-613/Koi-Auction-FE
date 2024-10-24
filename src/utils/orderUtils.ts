import { Order, OrderStatus } from "~/types/orders.type";

export const canLeaveFeedback = (order: Order) => {
  const processingDate = new Date(order.order_date);
  const currentDate = new Date();
  const daysSinceProcessing = Math.floor(
    (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
  );
  return order.status === OrderStatus.DELIVERED && daysSinceProcessing <= 7;
};

export const canAcceptShip = (order: Order) => {
  const processingDate = new Date(order.shipping_date);
  const currentDate = new Date();
  const daysSinceProcessing = Math.floor(
    (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
  );
  return order.status === OrderStatus.SHIPPED && daysSinceProcessing <= 7;
};

export const canConfirmOrder = (order: Order) => {
  const processingDate = new Date(order.shipping_date);
  const currentDate = new Date();
  const daysSinceProcessing = Math.floor(
    (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
  );
  return order.status === OrderStatus.PENDING && daysSinceProcessing <= 7;
};
