import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { ApiResponse } from "~/types/api.type";
import {
  AddNewAuctionDTO,
  AuctionDTO,
  AuctionModel,
  AuctionStatusCount,
} from "~/types/auctions.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { createAuctionFromApi } from "~/utils/dataConverter";
import { handleAxiosError } from "~/utils/errors.utils";

export const createNewAuction = async (
  newAuction: AddNewAuctionDTO,
): Promise<AddNewAuctionDTO | void> => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/auctions`,
      newAuction,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    if (response.status !== 201) {
      throw new Error("Failed to create new auction");
    }
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.CREATE_AUCTION_ERROR,
    );
  }
};

export const fetchAuctions = async (
  page: number,
  limit: number,
): Promise<AuctionModel[]> => {
  try {
    const response = await axios.get<ApiResponse<AuctionModel[]>>(
      `${DYNAMIC_API_URL}/auctions`,
      {
        params: { page, limit },
      },
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_ERROR,
    );

    return [];
  }
};

export const fetchAuctionsByStatus = async (
  page: number,
  limit: number,
  status: string,
) => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/auctions/koi_register`,
      {
        params: { page, limit, status },
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_BY_STATUS_ERROR,
    );
  }
};

export const fetchAuctionById = async (id: number) => {
  try {
    const response = await axios.get(`${DYNAMIC_API_URL}/auctions/${id}`);
    return createAuctionFromApi(response.data);
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_BY_ID_ERROR,
    );
    return null;
  }
};

export const updateAuction = async (
  id: number,
  auction: AddNewAuctionDTO,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/auctions/${id}`,
      auction,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.UPDATE_AUCTION_ERROR,
    );
  }
};

export const deleteAuction = async (
  id: number,
  accessToken: string,
): Promise<void> => {
  try {
    const response = await axios.delete(`${DYNAMIC_API_URL}/auctions/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 204) {
      console.log("Auction deleted successfully");
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.DELETE_AUCTION_ERROR,
    );
  }
};

export const endAuctionEmergency = async (auctionId: number) => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/auctions/end/${auctionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.END_AUCTION_ERROR,
    );
  }
};

export const fetchAuctionStatusCount = async () => {
  try {
    const response = await axios.get<AuctionStatusCount>(
      `${DYNAMIC_API_URL}/auctions/count-by-auction-status`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_STATUS_COUNT_ERROR,
    );
  }
};
