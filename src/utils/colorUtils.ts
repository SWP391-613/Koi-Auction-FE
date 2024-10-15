import { AUCTION_STATUS } from "~/constants/auctionStatus";

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

export const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    case "processing":
      return "primary";
    default:
      return "default";
  }
};
