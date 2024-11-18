import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { MembersResponse } from "~/types/paginated.types";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export const getMembersData = async (
  page: number,
  limit: number,
): Promise<MembersResponse> => {
  const response = await axios.get<MembersResponse>(
    `${API_URL_DEVELOPMENT}/members`,
    {
      params: {
        page: page - 1,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch members");
  }

  return response.data;
};
