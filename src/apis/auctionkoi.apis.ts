import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { AuctionKoi, BidMethod } from "~/types/auctionkois.type";
import { QuantityKoiInAuctionByBidMethod } from "~/types/auctions.type";
import { handleAxiosError } from "~/utils/errors.utils";

export const fetchAuctionKoi = async (auctionId: number) => {
  try {
    const response = await axios.get<AuctionKoi[]>(
      `${API_URL_DEVELOPMENT}/auctionkois/auction/${auctionId}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_KOI_ERROR,
    );
  }
};

export const fetchAuctionKoiDetails = async (
  auctionId: number,
  auctionKoiId: number,
): Promise<AuctionKoi | null> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/auctionkois/${auctionId}/${auctionKoiId}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_LOAD_AUCTION_KOI_DETAILS,
    );
    return null;
  }
};

export const postAuctionKoi = async (
  koi_id: number,
  auction_id: number,
  base_price: number,
  bid_step: number,
  bid_method: BidMethod,
  ceil_price: number,
  access_token: string,
) => {
  const auctionKoiPayload = {
    base_price,
    bid_step,
    bid_method,
    ceil_price,
    auction_id,
    koi_id,
  };

  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/auctionkois`,
      auctionKoiPayload,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    console.log("Auction Koi created successfully:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.CREATE_AUCTION_KOI_ERROR,
    );
  }
};

export const fetchQuantityKoiInAuctionByBidMethod = async () => {
  try {
    const response = await axios.get<QuantityKoiInAuctionByBidMethod>(
      `${API_URL_DEVELOPMENT}/auctionkois/count-by-bid-method`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_QUANTITY_KOI_IN_AUCTION_BY_BID_METHOD_ERROR,
    );
  }
};
