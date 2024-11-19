import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { getUserCookieToken } from "~/utils/auth.utils";

export const sendRequestUpdateRole = async (role: string, purpose: string) => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/mail/update-role?updateRole=${role}`,
      { purpose },
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.reason ||
        "An error occurred during send email update role";
      throw new Error(errorMessage);
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};
