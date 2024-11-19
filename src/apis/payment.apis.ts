import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import {
  PaymentDTO,
  PaymentPaginationResponse,
  PaymentStatus,
} from "~/types/payments.type";
import { getUserCookieToken } from "~/utils/auth.utils";

export const createDepositPayment = async (
  paymentRequest: PaymentDTO,
  token: string,
) => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/payments/create_deposit_payment`,
      paymentRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred during payment creation",
      );
    }
  }
};

export const createCashOrderPayment = async (
  paymentRequest: PaymentRequest,
  token: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/payments/cash/create_order_payment`,
      paymentRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order payment:", error);
    throw error;
  }
};

export const createOnlineOrderPayment = async (
  paymentRequest: PaymentDTO,
  token: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/payments/vnpay/create_order_payment`,
      paymentRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order payment:", error);
    throw error;
  }
};

export const createOrderPayment = async (
  paymentDTO: PaymentDTO,
  token: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/payments/create_order_payment`,
      paymentDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating order payment:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to process payment",
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};

export const createDrawOutRequest = async (
  paymentDTO: PaymentDTO,
  token: string,
) => {
  const response = await axios.post(
    `${DYNAMIC_API_URL}/payments/create_drawout_request`,
    paymentDTO,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getUserPaymentHistoryByStatus = async (
  user_id: number,
  status: string,
  page: number,
  limit: number,
  token?: string,
): Promise<PaymentPaginationResponse> => {
  const response = await axios.get(
    `${DYNAMIC_API_URL}/payments/user/${user_id}/get-sorted-payments`,
    {
      params: { status: status, page, limit },
      headers: { Authorization: `Bearer ${getUserCookieToken() || token}` },
    },
  );
  return response.data;
};

export const updatePaymentStatus = async (
  paymentId: number,
  paymentStatus: PaymentStatus,
  token?: string,
) => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/payments/${paymentId}/update-payment-status`,
      { status: paymentStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(ERROR_MESSAGE.UNEXPECTED_ERROR);
    }
  }
};
