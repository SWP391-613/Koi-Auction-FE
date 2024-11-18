import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import {
  AddNewAuctionDTO,
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
      `${API_URL_DEVELOPMENT}/auctions`,
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

export const fetchAuctions = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL_DEVELOPMENT}/auctions`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_ERROR,
    );

    return null;
  }
};

export const fetchAuctionsByStatus = async (
  page: number,
  limit: number,
  status: string,
) => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/auctions/koi_register`,
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
    const response = await axios.get(`${API_URL_DEVELOPMENT}/auctions/${id}`);
    return createAuctionFromApi(response.data);
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_AUCTION_BY_ID_ERROR,
    );
  }
};

export const updateAuction = async (
  id: number,
  auction: AddNewAuctionDTO,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/auctions/${id}`,
      auction,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    if (response.status === 200) {
      console.log("Auction update successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error update auction:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "An error occurred during update",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const deleteAuction = async (
  id: number,
  accessToken: string,
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${API_URL_DEVELOPMENT}/auctions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (response.status === 204) {
      console.log("Auction deleted successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting auction:", error.response?.data);
      throw new Error(
        error.response?.data?.reason || "An error occurred during deletion",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const endAuctionEmergency = async (auctionId: number) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/auctions/end/${auctionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error end auction", error.response?.data);
      throw new Error(
        error.response?.data?.reason || "An error occurred during end auction",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const fetchAuctionStatusCount = async () => {
  try {
    const response = await axios.get<AuctionStatusCount>(
      `${API_URL_DEVELOPMENT}/auctions/count-by-auction-status`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetch auction status count", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during fetch auction status count",
      );
    }
  }
};
