import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { Staff, StaffRegisterDTO } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

export const createStaff = async (
  staffData: StaffRegisterDTO,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/staffs`, staffData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.CREATE_STAFF_ERROR,
      false,
      ERROR_MESSAGE.CREATE_STAFF_ERROR,
    );
  }
};

export const deleteStaff = async (id: number, token: string): Promise<void> => {
  try {
    const response = await axios.delete(`${DYNAMIC_API_URL}/staffs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete staff");
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.DELETE_STAFF_ERROR,
      false,
      ERROR_MESSAGE.DELETE_STAFF_ERROR,
    );
  }
};

export const updateStaff = async (
  staffId: number,
  staffData: Staff,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/staffs/${staffId}`,
      staffData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.status !== 200) {
      throw new Error("Failed to update staff");
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UPDATE_STAFF_ERROR,
      false,
      ERROR_MESSAGE.UPDATE_STAFF_ERROR,
    );
  }
};

export const getStaffData = async (staffId: number): Promise<any> => {
  try {
    const response = await axios.get(`${DYNAMIC_API_URL}/staffs/${staffId}`, {
      headers: { Authorization: `Bearer ${getUserCookieToken()}` },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch staff data");
    }

    return response.data;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.FETCH_STAFF_ERROR,
      false,
      ERROR_MESSAGE.FETCH_STAFF_ERROR,
    );
  }
};
