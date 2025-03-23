import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { ApiResponse } from "~/types/api.type";
import { UserBase } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export const updateAccountBalance = async (
  userId: number,
  payment: number,
  token: string,
) => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/users/${userId}/deposit/${payment}`,
      {}, // If your API expects a body, add it here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (err: any) {
    handleAxiosError(
      err,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.UPDATE_ACCOUNT_BALANCE_ERROR,
    );
  }
};

export const verifyOtpToVerifyUser = async (
  email: string,
  otp: string,
): Promise<any> => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/users/verify`, {
      email,
      otp,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("OTP verification failed");
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.OTP_VERIFICATION_ERROR,
    );
  }
};

export const updateUserField = async (
  userId: number,
  field: string,
  value: any,
  token: string,
): Promise<void> => {
  const response = await axios.put(
    `${DYNAMIC_API_URL}/users/${userId}`,
    { [field]: value },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to update user information.");
  }
};

export const updateUserRole = async (
  id: number,
  roleId: number,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/users/${id}/update-role/${roleId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error("Failed to update user to breeder");
    }
  } catch (error) {
    handleAxiosError(
      error,
      "Failed to update user to breeder",
      true,
      "Failed to update user to breeder",
    );
  }
};

export const softDeleteUser = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete(`${DYNAMIC_API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    handleAxiosError(
      error,
      "Failed to delete user",
      true,
      "Failed to delete user",
    );
  }
};

export const undoDeleteUser = async (id: number): Promise<void> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/users/${id}/restore`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error("Failed to restore user");
    }
  } catch (error) {
    handleAxiosError(
      error,
      "Failed to restore user",
      true,
      "Failed to restore user",
    );
  }
};

export const fetchUserDetails = async () => {
  const response = await axios.post<ApiResponse<UserBase>>(
    `${DYNAMIC_API_URL}/auth/details`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );
  return response.data.data;
};
