import axios from "axios";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { UpdatePasswordDTO } from "~/types/users.type";

export const updateUserPassword = async (
  newPassword: UpdatePasswordDTO,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/forgot-password`,
      newPassword,
    );
    if (response.status === 200) {
      console.log("Password updated successfully");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
