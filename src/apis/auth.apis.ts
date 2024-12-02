import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import {
  LoginDTO,
  UserLoginResponse,
  UserRegisterDTO,
  UserRegisterResponse,
} from "~/types/users.type";
import { handleAxiosError } from "~/utils/errors.utils";

export const login = async (payload: LoginDTO) => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/auth/login`, payload);
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.LOGIN_ERROR,
    );
    return null;
  }
};

export const register = async (payload: UserRegisterDTO) => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/auth/register`, {
      first_name: payload.first_name || "",
      last_name: payload.last_name || "",
      email: payload.email || "",
      password: payload.password || "",
      confirm_password: payload.confirm_password || "",
      address: payload.address || "", // Optional
      date_of_birth: payload.date_of_birth || "", // Optional
      google_account_id: payload.google_account_id || 0, // Default value
      status: payload.status || "UNVERIFIED", // Default value for status
      role_id: payload.role_id || 1, // Default value for role_id
    });
    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.REGISTER_ERROR,
    );
  }
};

export const doLogout = async (token: string) => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      },
    );

    if (response.status === 200) {
      console.log("Logout successful.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
