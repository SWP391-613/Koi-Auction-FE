import axios, { AxiosError } from "axios";
import { environment } from "../environments/environment";
import {
  KoiApiResponse,
  KoiDetailModel,
  KoisResponse,
} from "~/types/kois.type";
import { Bid } from "~/components/BiddingHistory";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";
import { KoiOfBreeder as KoisOfBreeder } from "~/pages/breeder/BreederDetail";
import { BidRequest } from "~/pages/auctions/KoiBidding";
import {
  LoginDTO,
  UserRegisterDTO,
  UserLoginResponse,
  StaffRegisterDTO,
  Staff,
  MembersResponse,
  BreedersResponse,
} from "~/types/users.type";
import { AuctionDTO, AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import { OrderDetail } from "~/pages/user/UserOrderDetail";
import { Order } from "~/pages/user/UserOrder";
import { OrderDetailWithKoi } from "~/pages/user/UserOrderDetail";

const API_URL = `${environment.be.baseUrl}${environment.be.apiPrefix}`;

export const login = async (payload: LoginDTO): Promise<UserLoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, payload);
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
    const response = await axios.post(`${API_URL}/users/register`, fullData);
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
    return `Today, ${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};

export const createAuctionFromApi = (apiData: AuctionDTO): AuctionDTO => {
  return {
    id: apiData.id,
    title: apiData.title,
    start_time: formatDate(apiData.start_time),
    end_time: formatDate(apiData.end_time),
    status: apiData.status,
    auctioneer_id: apiData.auctioneer_id,
  };
};

export const createNewAuction = async (
  newAuction: AuctionModel,
): Promise<AuctionModel> => {
  try {
    const response = await axios.post(`${API_URL}/auctions`, newAuction);

    if (response.status !== 201) {
      throw new Error("Failed to create new auction");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating new auction:",
        error.response?.data?.message || error.message,
      );
    } else {
      if (error instanceof Error) {
        console.error("Error creating new auction:", error.message);
      } else {
        console.error(
          "Error creating new auction:",
          "An unexpected error occurred",
        );
      }
    }
    throw error;
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

    const response = await axios.get(`${API_URL}/auctions`, {
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

export const fetchAuctionById = async (
  id: number,
): Promise<AuctionDTO | null> => {
  try {
    const response = await axios.get(`${API_URL}/auctions/${id}`);
    return createAuctionFromApi(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching auction by ID:",
        error.response?.data?.message || error.message,
      );
    } else {
      if (error instanceof Error) {
        console.error("Error fetching auction by ID:", error.message);
      } else {
        console.error(
          "Error fetching auction by ID:",
          "An unexpected error occurred",
        );
      }
    }
    return null;
  }
};

export const fetchAuctionKoi = async (
  auctionId: number,
): Promise<AuctionKoi[]> => {
  try {
    const response = await axios.get<AuctionKoi[]>(
      `${API_URL}/auctionkois/auction/${auctionId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching auction koi data:", error);
    throw error;
  }
};

export const fetchKoisOfBreeder = async (
  breeder_id: number,
  page: number,
  limit: number,
): Promise<KoisOfBreeder | null> => {
  try {
    const response = await axios.get<KoisOfBreeder>(
      `${API_URL}/breeders/kois`,
      {
        params: { breeder_id, page, limit },
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
      `${API_URL}/kois?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching koi data:", error);
    throw error;
  }
}

export async function getKoiById(id: number): Promise<KoiDetailModel> {
  try {
    const response = await axios.get<KoiDetailModel>(`${API_URL}/kois/${id}`);
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
      `${API_URL}/auctionkois/${auctionId}/${auctionKoiId}`,
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
  const response = await fetch(`${API_URL}/bidding/${auctionKoiId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bid history");
  }
  return response.json();
};

export const doLogout = async (token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/logout`,
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
      `${API_URL}/users/${userId}/deposit/${payment}`,
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

export const placeBid = async (bid: BidRequest): Promise<void> => {
  try {
    await axios.post(
      `${environment.be.baseUrl}${environment.be.apiPrefix}${environment.be.endPoint.bidding}/bid/${bid.auction_koi_id}`.trim(),
      bid,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Add this line
        },
      },
    );
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

export const fetchUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const response = await axios.get(
      `${API_URL}${environment.be.endPoint.orders}/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
): Promise<OrderDetailWithKoi[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/orders_details/order/${orderId}`,
    );
    const orderDetails: OrderDetail[] = response.data;

    // Fetch Koi data for each order detail
    const orderDetailsWithKoi = await Promise.all(
      orderDetails.map(async (detail) => {
        const koiData = await getKoiById(detail.product_id);
        return {
          ...detail,
          koi: {
            name: koiData.name,
            image_url: koiData.thumbnail,
          },
        };
      }),
    );

    return orderDetailsWithKoi;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const createDepositPayment = async (

  amount: number,
  token: string,
  userId: number,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/vnpay/create_deposit`,
      { amount, userId },
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
      `${API_URL}/otp/send?type=mail&recipient=${email}`,
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

export const verifyOtp = async (email: string, otp: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/users/verify`, {
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

export const deleteAuction = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/auctions/${id}`);
    if (response.status === 204) {
      console.log("Auction deleted successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting auction:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "An error occurred during deletion",
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
    `${API_URL}/users/${userId}`,
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
  const response = await axios.post(`${API_URL}/staffs`, staffData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 201) {
    throw new Error(response.data?.reason || "Failed to create staff.");
  }
};

export const deleteStaff = async (id: number, token: string): Promise<void> => {
  const API_URL = `http://localhost:4000/api/v1/staffs/${id}`;
  const response = await axios.delete(API_URL, {
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
  const API_URL = `http://localhost:4000/api/v1/staffs/${staffId}`;
  const response = await axios.put(API_URL, staffData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    throw new Error("Failed to update staff");
  }
};

export const getStaffData = async (
  staffId: number,
  token: string,
): Promise<any> => {
  const API_URL = `http://localhost:4000/api/v1/staffs/${staffId}`;
  const response = await axios.get(API_URL, {
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
    "http://localhost:4000/api/v1/members",
    {
      params: {
        page: page - 1,
        limit: limit,
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
): Promise<KoiApiResponse> => {
  const response = await axios.get<KoiApiResponse>(
    "http://localhost:4000/api/v1/kois",
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

export const deleteKoiById = async (
  id: number,
  accessToken: string,
): Promise<void> => {
  const response = await axios.delete(
    `http://localhost:4000/api/v1/kois/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 204) {
    throw new Error("Failed to delete koi");
  }
};

export const createKoi = async (
  formData: FormData,
): Promise<KoiDetailModel> => {
  const response = await axios.post<KoiDetailModel>(
    "http://localhost:4000/api/v1/kois",
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

export const updateKoi = async (
  koiId: number,
  koi: KoiDetailModel,
  accessToken: string,
) => {
  const response = await axios.put(
    `http://localhost:4000/api/v1/kois/${koiId}`,
    koi,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to update koi");
  }

  return response.data;
};

export const fetchKoi = async (koiId: number, accessToken: string) => {
  const response = await axios.get(
    `http://localhost:4000/api/v1/kois/${koiId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch koi data");
  }

  return response.data;
};

export const fetchBreedersData = async (page: number, itemsPerPage: number) => {
  const response = await axios.get<BreedersResponse>(
    "http://localhost:4000/api/v1/breeders",
    {
      params: {
        page: page - 1, // Adjusting for zero-based indexing
        limit: itemsPerPage,
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
      `${API_URL}${environment.be.endPoint.orders}/${order.id}`,
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

export const createOrderPayment = async (amount: number, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/vnpay/create_order_payment`,
      { amount },
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
