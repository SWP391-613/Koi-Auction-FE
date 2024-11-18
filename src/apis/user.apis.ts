import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { Staff, StaffRegisterDTO } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/error.utils";

export const updateAccountBalance = async (
  userId: number,
  payment: number,
  token: string,
) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/users/${userId}/deposit/${payment}`,
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
    const response = await axios.post(`${API_URL_DEVELOPMENT}/users/verify`, {
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
    `${API_URL_DEVELOPMENT}/users/${userId}`,
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
