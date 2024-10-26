import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { OrderStatus } from "~/types/orders.type";
import { PaymentStatus } from "~/types/payments.type";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-500";
    case "UNVERIFIED":
      return "bg-yellow-500";
    case "SOLD":
      return "bg-red-500";
    case "REJECTED":
      return "bg-gray-500";
    case "PENDING":
      return "bg-blue-500";
    default:
      return "bg-gray-300";
  }
};

type AuctionStatus = (typeof AUCTION_STATUS)[keyof typeof AUCTION_STATUS];

export const getAuctionStatusColor = (
  status: AuctionStatus | string,
): string => {
  switch (status) {
    case AUCTION_STATUS.UPCOMING:
      return "bg-yellow-500 text-white";
    case AUCTION_STATUS.ONGOING:
      return "bg-green-500 text-white";
    case AUCTION_STATUS.ENDED:
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white"; // Fallback color in case of an unexpected status
  }
};

export const getOrderStatusColor = (status: OrderStatus | string): string => {
  switch (status.toUpperCase()) {
    case OrderStatus.ALL:
      return "success";
    case OrderStatus.PENDING:
      return "warning";
    case OrderStatus.PROCESSING:
      return "primary";
    case OrderStatus.SHIPPING:
      return "info";
    case OrderStatus.DELIVERED:
      return "success";
    case OrderStatus.COMPLETED:
      return "success-dark"; // A darker shade of success
    case OrderStatus.CANCELLED:
      return "error";
    default:
      return "default";
  }
};

export const getPaymentStatusColor = (
  status: PaymentStatus | string,
): string => {
  switch (status.toUpperCase()) {
    case PaymentStatus.ALL:
      return "primary";
    case PaymentStatus.SUCCESS:
      return "success";
    case PaymentStatus.PENDING:
      return "warning";
    case PaymentStatus.REFUNDED:
      return "info";
    default:
      return "default";
  }
};
