import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ERROR_MESSAGE } from "~/constants/message";
import { environment } from "~/environments/environment";
import {
  Order,
  OrderDetail,
  OrderPaginationResponse,
  OrderStatus,
} from "~/types/orders.type";
import { Staff, StaffRegisterDTO } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";

export const fetchOrderDetails = async (
  orderId: number,
): Promise<OrderDetail[]> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/orders_details/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during fetch order details",
      );
    }
    throw error;
  }
};

export const fetchOrderById = async (
  orderId: number,
  token: string,
): Promise<Order> => {
  const response = await axios.get(`${DYNAMIC_API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchUserOrders = async (
  userId: number,
  token: string,
): Promise<Order[]> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}${environment.be.endPoint.orders}/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const updateOrder = async (
  order: Order,
  accessToken: string,
): Promise<Order> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}${environment.be.endPoint.orders}/${order.id}`,
      order,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update order");
    }
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const getUserOrderByStatus = async (
  userId: number,
  status: string,
  page: number,
  limit: number,
  token?: string,
): Promise<OrderPaginationResponse> => {
  const response = await axios.get(
    `${DYNAMIC_API_URL}/orders/user/${userId}/get-active-sorted-orders`,
    {
      params: { keyword: status, page, limit },
      headers: { Authorization: `Bearer ${getUserCookieToken() || token}` },
    },
  );
  return response.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await axios.get(`${DYNAMIC_API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${getUserCookieToken()}` },
  });
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  newStatus: OrderStatus,
  token?: string,
) => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/orders/${orderId}/update-order-status`,
      { status: newStatus },
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

export const confirmOrder = async (
  orderId: number,
  newStatus: OrderStatus,
  token: string,
): Promise<Order> => {
  try {
    const response = await axios.put(
      `${DYNAMIC_API_URL}/orders/${orderId}/confirm-delivery`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update order status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
