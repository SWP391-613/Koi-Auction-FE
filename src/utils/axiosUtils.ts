import axios from "axios";
import { toast } from "react-toastify";

interface ApiResponse<T> {
  data: T;
}

export const getRequestById = async <T>(
  url: string,
  id: string | number,
  accessToken: string | null,
): Promise<T | null> => {
  try {
    const response = await axios.get<ApiResponse<T>>(`${url}/${id}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    });

    return response.data.data; // Return the data of type T
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.reason || "An error occurred";
      toast.error(errorMessage); // Show toast error
    } else {
      toast.error("An unknown error occurred");
    }

    return null; // Return null in case of error
  }
};

export const postRequest = async <T>(
  url: string,
  data: T,
  accessToken: string | null,
): Promise<T | null> => {
  try {
    const response = await axios.post<ApiResponse<T>>(url, data, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    });

    toast.success("Operation was successful!");
    return response.data.data; // Return the response data if needed
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.reason ||
        "An error occurred during the operation";
      toast.error(errorMessage); // Show toast error
    } else {
      toast.error("An unknown error occurred");
    }
    return null; // Return null in case of error
  }
};
