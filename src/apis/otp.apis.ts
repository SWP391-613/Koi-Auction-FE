import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";

export const sendOtp = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/otp/send?type=mail&recipient=${email}`,
    );
    if (response.status === 200) {
      console.log("OTP sent successfully");
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error sending OTP:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "An error occurred during OTP sending",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const sendOtpForgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/forgot-password?toEmail=${email}`,
    );
    if (response.status === 200) {
      console.log("OTP sent successfully");
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error sending OTP:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "An error occurred during OTP sending",
      );
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const verifyOtpIsCorrect = async (
  email: string,
  otp: string,
): Promise<any> => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/otp/verify`, {
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
