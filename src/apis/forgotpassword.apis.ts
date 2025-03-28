import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { UpdatePasswordDTO } from "~/types/users.type";

export const updateUserPassword = async (
  newPassword: UpdatePasswordDTO,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/forgot-password`,
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
