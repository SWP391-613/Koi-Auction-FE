import axios, { AxiosError } from "axios";
import { environment } from "../environments/environment.ts";
import { RegisterDTO } from "~/dtos/register.dto.ts";

const API_URL = `${environment.be.baseUrl}${environment.be.apiPrefix}`;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Narrowing down to AxiosError type
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      throw new Error(errorMessage);
    } else {
      // Generic fallback error message
      throw new Error("An unexpected error occurred");
    }
  }
};

export const register = async (data: RegisterDTO) => {
  const fullData: RegisterDTO = {
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    password: data.password || "",
    confirm_password: data.confirm_password || "",
    address: data.address || "", // Optional
    date_of_birth: data.date_of_birth || "", // Optional
    google_account_id: data.google_account_id || 0, // Default value
    status: data.status || "UNVERIFIED", // Default value for status
    role_id: data.role_id || 1, // Default value for role_id
  };
  try {
    const response = await axios.post(`${API_URL}/users/register`, fullData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Narrowing down to AxiosError type
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration";
      throw new Error(errorMessage);
    } else {
      // Generic fallback error message
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchGoogleClientId = async () => {
  try {
    const response = await axios.get(`${API_URL}/oauth2/google-client-id`);
    return response.data.clientId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Google client ID:",
        error.response?.data?.message || error.message,
      );
    } else {
      console.error(
        "Error fetching Google client ID:",
        "An unexpected error occurred",
      );
    }
    return null;
  }
};
