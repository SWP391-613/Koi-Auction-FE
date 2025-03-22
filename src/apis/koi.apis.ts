import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { ApiResponse } from "~/types/api.type";
import { KoiDetailModel, UpdateKoiDTO } from "~/types/kois.type";
import { KoiInAuctionResponse, KoisResponse } from "~/types/paginated.types";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export async function fetchKoiById(id: number) {
  const response = await axios.get<ApiResponse<KoiDetailModel>>(
    `${DYNAMIC_API_URL}/kois/${id}`,
  );
  return response.data.data;
}

export const getKoiData = async (
  page: number,
  limit: number,
): Promise<KoisResponse | void> => {
  try {
    const response = await axios.get<KoisResponse>(`${DYNAMIC_API_URL}/kois`, {
      params: {
        page: page - 1, // Assuming the API is zero-based
        limit: limit,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_LOAD_KOIS,
    );
  }
};

export const getKoiInAuctionData = async (
  keyword: string,
  page: number,
  limit: number,
): Promise<KoiInAuctionResponse | void> => {
  try {
    const response = await axios.get<KoiInAuctionResponse>(
      `${DYNAMIC_API_URL}/auctionkois/get-kois-by-keyword`,
      {
        params: {
          keyword: "",
          page: page - 1, // Assuming the API is zero-based
          limit,
        },
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_LOAD_KOIS_IN_AUCTION,
    );
  }
};

export const deleteKoiById = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete(`${DYNAMIC_API_URL}/kois/${id}`, {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete koi");
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.FAILED_TO_DELETE_KOI,
    );
  }
};

export const updateKoi = async (koiId: number, koi: KoiDetailModel) => {
  try {
    const response = await axios.put(`${DYNAMIC_API_URL}/kois/${koiId}`, koi, {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_UPDATE_KOI,
    );
  }
};

export const fetchKoi = async (koiId: number) => {
  try {
    const response = await axios.get(`${DYNAMIC_API_URL}/kois/${koiId}`, {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch koi data");
    }

    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FAILED_TO_LOAD_KOIS,
    );
  }
};

export const createKoi = async (
  formData: FormData,
): Promise<KoiDetailModel> => {
  const response = await axios.post<KoiDetailModel>(
    `${DYNAMIC_API_URL}/kois`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (response.status !== 201) {
    throw new Error("Failed to create koi");
  }

  return response.data;
};
