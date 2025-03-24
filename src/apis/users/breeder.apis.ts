import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";
import { KoiOfBreeder as KoisOfBreeder } from "~/pages/detail/breeder/BreederDetail";
import { BreedersResponse } from "~/types/paginated.types";
import { ApiResponse } from "~/types/api.type";

export const fetchKoisOfBreeder = async (
  breeder_id: number,
  page: number,
  limit: number,
  access_token: string,
): Promise<KoisOfBreeder | void> => {
  try {
    const response = await axios.get<KoisOfBreeder>(
      `${DYNAMIC_API_URL}/breeders/kois`,
      {
        params: { breeder_id, page, limit },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.FETCH_BREEDER_KOI_ERROR,
    );
  }
};

export const fetchKoisOfBreederWithStatus = async (
  breeder_id: number,
  page: number,
  limit: number,
): Promise<KoisOfBreeder | void> => {
  try {
    const response = await axios.get<KoisOfBreeder>(
      `${DYNAMIC_API_URL}/breeders/kois/not-in-auction`,
      {
        params: { breeder_id, page, limit },
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
      ERROR_MESSAGE.FETCH_BREEDER_KOI_WITH_STATUS_ERROR,
    );
  }
};

export const fetchBreedersData = async (page: number, itemsPerPage: number) => {
  const response = await axios.get<BreedersResponse[]>(
    `${DYNAMIC_API_URL}/breeders`,
    {
      params: {
        page: page,
        limit: itemsPerPage,
      },
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );

  return response.data;
};
