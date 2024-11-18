import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { KoiDetailModel, UpdateKoiDTO } from "~/types/kois.type";
import { KoiInAuctionResponse, KoisResponse } from "~/types/paginated.types";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export async function fetchKoiById(id: number) {
  try {
    const response = await axios.get<KoiDetailModel>(
      `${API_URL_DEVELOPMENT}/kois/${id}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_KOI_BY_ID_ERROR,
    );
  }
}

export const getKoiData = async (
  page: number,
  limit: number,
): Promise<KoisResponse | void> => {
  try {
    const response = await axios.get<KoisResponse>(
      `${API_URL_DEVELOPMENT}/kois`,
      {
        params: {
          page: page - 1, // Assuming the API is zero-based
          limit: limit,
        },
      },
    );

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
      `${API_URL_DEVELOPMENT}/auctionkois/get-kois-by-keyword`,
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
    const response = await axios.delete(`${API_URL_DEVELOPMENT}/kois/${id}`, {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    });

    if (response.status !== 204) {
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

export const updateKoi = async (koiId: number, koi: UpdateKoiDTO) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/kois/${koiId}`,
      koi,
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
      false,
      ERROR_MESSAGE.FAILED_TO_UPDATE_KOI,
    );
  }
};

export const fetchKoi = async (koiId: number) => {
  try {
    const response = await axios.get(`${API_URL_DEVELOPMENT}/kois/${koiId}`, {
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
    `${API_URL_DEVELOPMENT}/kois`,
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
