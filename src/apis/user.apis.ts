import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { Staff, StaffRegisterDTO } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";

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
    //check the where error from and throw the error
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "An error occurred during deposit",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
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
    if (axios.isAxiosError(error)) {
      console.error("Error verifying OTP:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during verification",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
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
