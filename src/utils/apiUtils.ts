import axios, { AxiosError } from "axios";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Bid } from "~/components/koibiddingdetail/BiddingHistory";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { BidRequest } from "~/pages/auctions/KoiBidding";
import { KoiOfBreeder as KoisOfBreeder } from "~/pages/detail/breeder/BreederDetail";
import { FeedbackRequest } from "~/pages/detail/member/Feedback";
import { AuctionKoi, BidMethod } from "~/types/auctionkois.type";
import { AddNewAuctionDTO, AuctionModel } from "~/types/auctions.type";
import { KoiDetailModel, UpdateKoiDTO } from "~/types/kois.type";
import {
  Order,
  OrderDetail,
  OrderPaginationResponse,
  OrderStatus,
} from "~/types/orders.type";
import {
  BreedersResponse,
  KoiInAuctionResponse,
  KoisResponse,
  MembersResponse,
} from "~/types/paginated.types";
import {
  PaymentDTO,
  PaymentPaginationResponse,
  PaymentStatus,
} from "~/types/payments.type";
import {
  LoginDTO,
  Staff,
  StaffRegisterDTO,
  UpdatePasswordDTO,
  UserLoginResponse,
  UserRegisterDTO,
} from "~/types/users.type";
import { environment } from "../environments/environment";
import { getUserCookieToken } from "./auth.utils";

export const login = async (payload: LoginDTO): Promise<UserLoginResponse> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/users/login`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Narrowing down to AxiosError type
      const errorMessage =
        error.response?.data?.reason || "An error occurred during login";
      throw new Error(errorMessage);
    } else {
      // Generic fallback error message
      throw new Error("An unexpected error occurred");
    }
  }
};

export const register = async (payload: UserRegisterDTO) => {
  const fullData: UserRegisterDTO = {
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
  };
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/users/register`,
      fullData,
    );
    console.log("Data ne: " + JSON.stringify(response));

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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isYesterday(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isTomorrow(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};

export const createAuctionFromApi = (apiData: AuctionModel): AuctionModel => {
  return {
    id: apiData.id,
    title: apiData.title,
    start_time: formatDate(apiData.start_time.toString()),
    end_time: formatDate(apiData.end_time.toString()),
    end_time_countdown: apiData.end_time,
    status: apiData.status,
    auctioneer_id: apiData.auctioneer_id,
  };
};

export const createNewAuction = async (
  newAuction: AddNewAuctionDTO,
): Promise<AddNewAuctionDTO> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/auctions`,
      newAuction,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    if (response.status !== 201) {
      throw new Error("Failed to create new auction");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Narrowing down to AxiosError type
      const errorMessage =
        error.response?.data?.reason ||
        "An error occurred during create new auction";
      throw new Error(errorMessage);
    } else {
      // Generic fallback error message
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchAuctions = async (
  page: number,
  limit: number,
): Promise<AuctionModel[]> => {
  try {
    // if (getCookie("access_token") === null) {
    //   throw new Error("You are not logged in");
    // }

    const response = await axios.get(`${API_URL_DEVELOPMENT}/auctions`, {
      params: { page, limit },
    });

    // Map the response data to Auction model
    const auctions: AuctionModel[] = response.data; //need raw data to calculate the time range of the auction
    return auctions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching auctions:",
        error.response?.data?.message || error.message,
      );
    } else {
      if (error instanceof Error) {
        console.error("Error fetching auctions:", error.message);
      } else {
        console.error(
          "Error fetching auctions:",
          "An unexpected error occurred",
        );
      }
    }
    return [];
  }
};

export const fetchAuctionsByStatus = async (
  page: number,
  limit: number,
  status: string,
): Promise<AuctionModel[]> => {
  try {
    // if (getCookie("access_token") === null) {
    //   throw new Error("You are not logged in");
    // }

    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/auctions/koi_register`,
      {
        params: { page, limit, status },
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    // Map the response data to Auction model
    const auctions: AuctionModel[] = response.data; //need raw data to calculate the time range of the auction
    return auctions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching auctions:",
        error.response?.data?.message || error.message,
      );
    } else {
      if (error instanceof Error) {
        console.error("Error fetching auctions:", error.message);
      } else {
        console.error(
          "Error fetching auctions:",
          "An unexpected error occurred",
        );
      }
    }
    return [];
  }
};

export const fetchAuctionById = async (
  id: number,
): Promise<AuctionModel | null> => {
  try {
    const response = await axios.get(`${API_URL_DEVELOPMENT}/auctions/${id}`);
    return createAuctionFromApi(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetch auction:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during fetch auction",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchAuctionKoi = async (
  auctionId: number,
): Promise<AuctionKoi[]> => {
  try {
    const response = await axios.get<AuctionKoi[]>(
      `${API_URL_DEVELOPMENT}/auctionkois/auction/${auctionId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetch auction koi:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred during fetch auction koi",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchKoisOfBreeder = async (
  breeder_id: number,
  page: number,
  limit: number,
  access_token: string,
): Promise<KoisOfBreeder | null> => {
  try {
    const response = await axios.get<KoisOfBreeder>(
      `${API_URL_DEVELOPMENT}/breeders/kois`,
      {
        params: { breeder_id, page, limit },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching koi's breeder data:",
        error.response?.data?.message || error.message,
      );
    }
    throw error;
  }
};

export const fetchKoisOfBreederWithStatus = async (
  breeder_id: number,
  page: number,
  limit: number,
): Promise<KoisOfBreeder | null> => {
  try {
    const response = await axios.get<KoisOfBreeder>(
      `${API_URL_DEVELOPMENT}/breeders/kois/not-in-auction`,
      {
        params: { breeder_id, page, limit },
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching koi's breeder data:",
        error.response?.data?.message || error.message,
      );
    }
    throw error;
  }
};

export async function getKois(
  page: number,
  limit: number,
): Promise<KoisResponse> {
  try {
    const response = await axios.get<KoisResponse>(
      `${API_URL_DEVELOPMENT}/kois?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching koi data:", error);
    throw error;
  }
}

export async function getKoiById(
  id: number,
  token?: string,
): Promise<KoiDetailModel> {
  try {
    const response = await axios.get<KoiDetailModel>(
      `${API_URL_DEVELOPMENT}/kois/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching koi data:", error);
    throw error;
  }
}

export const fetchAuctionKoiDetails = async (
  auctionId: number,
  auctionKoiId: number,
): Promise<AuctionKoi> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/auctionkois/${auctionId}/${auctionKoiId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(
        `Failed to fetch auction koi details: ${error.response?.data?.message || error.message}`,
      );
    } else {
      throw error;
    }
  }
};

export const fetchBidHistory = async (auctionKoiId: number): Promise<Bid[]> => {
  const response = await fetch(
    `${API_URL_DEVELOPMENT}/bidding/${auctionKoiId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch bid history");
  }
  return response.json();
};

export const doLogout = async (token: string) => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/users/logout`,
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

export const updateAccountBalance = async (
  userId: number,
  payment: number,
  token: string,
) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/users/${userId}/deposit/${payment}`,
      {}, // If your API expects a body, add it here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (err: any) {
    //check the where error from and throw the error
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "An error occurred during deposit",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const placeBid = async (
  bid: BidRequest,
): Promise<{ isSold: boolean }> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/bidding/bid/${bid.auction_koi_id}`,
      bid,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );

    return { isSold: response.data.isSold };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (error.response.data.reason === "BiddingRuleException") {
        throw new Error(
          error.response.data.message || "Bidding rule violation",
        );
      }
      throw new Error("Failed to place bid");
    }
    throw new Error("Network error");
  }
};

export const fetchUserOrders = async (
  userId: number,
  token: string,
): Promise<Order[]> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}${environment.be.endPoint.orders}/user/${userId}`,
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

export const fetchOrderDetails = async (
  orderId: number,
): Promise<OrderDetail[]> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/orders_details/order/${orderId}`,
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
  const response = await axios.get(`${API_URL_DEVELOPMENT}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createDepositPayment = async (
  paymentRequest: PaymentDTO,
  token: string,
) => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/payments/create_deposit_payment`,
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

export const sendOtp = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/otp/send?type=mail&recipient=${email}`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const sendOtpForgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/forgot-password?toEmail=${email}`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const verifyOtpToVerifyUser = async (
  email: string,
  otp: string,
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL_DEVELOPMENT}/users/verify`, {
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const verifyOtpIsCorrect = async (
  email: string,
  otp: string,
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL_DEVELOPMENT}/otp/verify`, {
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateAuction = async (
  id: number,
  auction: AddNewAuctionDTO,
): Promise<void> => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/auctions/${id}`,
      auction,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    if (response.status === 200) {
      console.log("Auction update successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error update auction:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "An error occurred during update",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const deleteAuction = async (
  id: number,
  accessToken: string,
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${API_URL_DEVELOPMENT}/auctions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (response.status === 204) {
      console.log("Auction deleted successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting auction:", error.response?.data);
      throw new Error(
        error.response?.data?.reason || "An error occurred during deletion",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateUserField = async (
  userId: number,
  field: string,
  value: any,
  token: string,
): Promise<void> => {
  const response = await axios.put(
    `${API_URL_DEVELOPMENT}/users/${userId}`,
    { [field]: value },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to update user information.");
  }
};

export const createStaff = async (
  staffData: StaffRegisterDTO,
  token: string,
): Promise<void> => {
  const response = await axios.post(
    `${API_URL_DEVELOPMENT}/staffs`,
    staffData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 201) {
    throw new Error(response.data?.reason || "Failed to create staff.");
  }
};

export const deleteStaff = async (id: number, token: string): Promise<void> => {
  const response = await axios.delete(`${API_URL_DEVELOPMENT}/staffs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete staff");
  }
};

export const updateStaff = async (
  staffId: number,
  staffData: Staff,
  token: string,
): Promise<void> => {
  const response = await axios.put(
    `${API_URL_DEVELOPMENT}/staffs/${staffId}`,
    staffData,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to update staff");
  }
};

export const getStaffData = async (
  staffId: number,
  token: string,
): Promise<any> => {
  const response = await axios.get(`${API_URL_DEVELOPMENT}/staffs/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch staff data");
  }

  return response.data;
};

export const getMembersData = async (
  page: number,
  limit: number,
): Promise<MembersResponse> => {
  const response = await axios.get<MembersResponse>(
    `${API_URL_DEVELOPMENT}/members`,
    {
      params: {
        page: page - 1,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch members");
  }

  return response.data;
};

export const getKoiData = async (
  page: number,
  limit: number,
): Promise<KoisResponse> => {
  const response = await axios.get<KoisResponse>(
    `${API_URL_DEVELOPMENT}/kois`,
    {
      params: {
        page: page - 1, // Assuming the API is zero-based
        limit: limit,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch kois");
  }

  return response.data;
};

export const getKoiInAuctionData = async (
  keyword: string,
  page: number,
  limit: number,
): Promise<KoiInAuctionResponse> => {
  const response = await axios.get<KoiInAuctionResponse>(
    `${API_URL_DEVELOPMENT}/auctionkois/get-kois-by-keyword`,
    {
      params: {
        keyword: "",
        page: page - 1, // Assuming the API is zero-based
        limit,
      },
    },
  );

  console.log("Data ne: " + JSON.stringify(response.data));

  if (response.status !== 200) {
    throw new Error("Failed to fetch kois");
  }

  return response.data;
};

export const deleteKoiById = async (
  id: number,
  accessToken: string,
): Promise<void> => {
  const response = await axios.delete(`${API_URL_DEVELOPMENT}/kois/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete koi");
  }
};

export const createKoi = async (
  formData: FormData,
): Promise<KoiDetailModel> => {
  const response = await axios.post<KoiDetailModel>(
    `${API_URL_DEVELOPMENT}/kois`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (response.status !== 201) {
    throw new Error("Failed to create koi");
  }

  return response.data;
};

export const updateKoi = async (koiId: number, koi: UpdateKoiDTO) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/kois/${koiId}`,
      koi,
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error update koi's breeder:",
        error.response?.data?.message || error.message,
      );
    }
    throw error;
  }
};

export const fetchKoi = async (koiId: number) => {
  const response = await axios.get(`${API_URL_DEVELOPMENT}/kois/${koiId}`, {
    headers: {
      Authorization: `Bearer ${getUserCookieToken()}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch koi data");
  }

  return response.data;
};

export const fetchBreedersData = async (page: number, itemsPerPage: number) => {
  const response = await axios.get<BreedersResponse>(
    `${API_URL_DEVELOPMENT}/breeders`,
    {
      params: {
        page: page - 1, // Adjusting for zero-based indexing
        limit: itemsPerPage,
      },
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch breeders");
  }

  return response.data;
};

export const updateOrder = async (
  order: Order,
  accessToken: string,
): Promise<Order> => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}${environment.be.endPoint.orders}/${order.id}`,
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

export const createCashOrderPayment = async (
  paymentRequest: PaymentRequest,
  token: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/payments/cash/create_order_payment`,
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
      `${API_URL_DEVELOPMENT}/payments/vnpay/create_order_payment`,
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
      `${API_URL_DEVELOPMENT}/payments/create_order_payment`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const postAuctionKoi = async (
  koi_id: number,
  auction_id: number,
  base_price: number,
  bid_step: number,
  bid_method: BidMethod,
  ceil_price: number,
  access_token: string,
) => {
  const auctionKoiPayload = {
    base_price,
    bid_step,
    bid_method,
    ceil_price,
    auction_id,
    koi_id,
  };

  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/auctionkois`,
      auctionKoiPayload,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    console.log("Auction Koi created successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.reason || "Failed to create auction koi",
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

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

export const submitFeedback = async (
  feedbackData: FeedbackRequest,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_URL_DEVELOPMENT}/feedbacks`,
      feedbackData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.reason || "Failed to submit feedback";
      throw new Error(errorMessage);
    }
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
    `${API_URL_DEVELOPMENT}/orders/user/${userId}/get-active-sorted-orders`,
    {
      params: { keyword: status, page, limit },
      headers: { Authorization: `Bearer ${getUserCookieToken() || token}` },
    },
  );
  return response.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await axios.get(`${API_URL_DEVELOPMENT}/orders/${orderId}`, {
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
      `${API_URL_DEVELOPMENT}/orders/${orderId}/update-order-status`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getFeedbackByOrderId = async (orderId: number, token: string) => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/feedbacks/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {}
};

export const confirmOrder = async (
  orderId: number,
  newStatus: OrderStatus,
  token: string,
): Promise<Order> => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/orders/${orderId}/confirm-delivery`,
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

export const createDrawOutRequest = async (
  paymentDTO: PaymentDTO,
  token: string,
) => {
  const response = await axios.post(
    `${API_URL_DEVELOPMENT}/payments/create_drawout_request`,
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
    `${API_URL_DEVELOPMENT}/payments/user/${user_id}/get-sorted-payments`,
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
      `${API_URL_DEVELOPMENT}/payments/${paymentId}/update-payment-status`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getUserHighestBidInAuctionKoi = async (
  auctionKoiId: number,
  userId: number,
): Promise<Bid> => {
  const response = await axios.get(
    `${API_URL_DEVELOPMENT}/bidding/${auctionKoiId}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${getUserCookieToken()}`,
      },
    },
  );
  return response.data;
};

export const sendRequestUpdateRole = async (role: string, purpose: string) => {
  try {
    const response = await axios.get(
      `${API_URL_DEVELOPMENT}/mail/update-role?updateRole=${role}`,
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
      throw new Error("An unexpected error occurred");
    }
  }
};

export const endAuctionEmergency = async (auctionId: number) => {
  try {
    const response = await axios.put(
      `${API_URL_DEVELOPMENT}/auctions/end/${auctionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getUserCookieToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error end auction", error.response?.data);
      throw new Error(
        error.response?.data?.reason || "An error occurred during end auction",
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
