import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { BidRequest } from "~/pages/auctions/KoiBidding";
import { Bid } from "~/types/bids.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export const fetchBidHistory = async (
  auctionKoiId: number,
): Promise<Bid[] | void> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/bidding/${auctionKoiId}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_FETCH_BIDDING_HISTORY,
    );
  }
};

export const placeBid = async (
  bid: BidRequest,
): Promise<{ isSold: boolean }> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/bidding/bid/${bid.auction_koi_id}`,
      bid,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    return { isSold: response.data.isSold };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (error.response.data.reason === "BiddingRuleException") {
        throw new Error(
          error.response.data.message || "Bidding rule violation",
        );
      }
      throw new Error("Failed to place bid");
    }
    throw new Error("Network error");
  }
};

export const getUserHighestBidInAuctionKoi = async (
  auctionKoiId: number,
  userId: number,
): Promise<Bid> => {
  const response = await axios.get(
    `${API_URL_DEVELOPMENT}/bidding/${auctionKoiId}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );
  return response.data;
};
