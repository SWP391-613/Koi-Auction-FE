import axios, { AxiosError } from "axios";
import { environment } from "../environments/environment";
import { AuctionKoi } from "~/pages/auctions/AuctionDetail";
import { RegisterDTO } from "~/dtos/register.dto";
import { LoginDTO, UserLoginResponse } from "~/dtos/login.dto";
import { KoiDetailModel, KoisResponse } from "~/pages/kois/Kois";
import { Auction } from "~/pages/auctions/Auctions";
import { Bid } from "~/components/BiddingHistory";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";
import { KoiOfBreeder as KoisOfBreeder } from "~/pages/breeder/BreederDetail";
import { toast } from "react-toastify";

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

export const register = async (payload: RegisterDTO) => {
  const fullData: RegisterDTO = {
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

const createAuctionFromApi = (apiData: any): Auction => {
  return {
    id: apiData.id,
    title: apiData.title,
    start_time: formatDate(apiData.start_time),
    end_time: formatDate(apiData.end_time),
    status: apiData.status,
  };
};

export const fetchAuctions = async (
  page: number,
  limit: number,
): Promise<Auction[]> => {
  try {
    // if (getCookie("access_token") === null) {
    //   throw new Error("You are not logged in");
    // }

    const response = await axios.get(`${API_URL}/auctions`, {
      params: { page, limit },
    });

    // Map the response data to Auction model
    const auctions: Auction[] = response.data; //need raw data to calculate the time range of the auction
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

export const fetchAuctionById = async (id: number): Promise<Auction | null> => {
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
  const response = await fetch(`${API_URL}/auctionkoidetails/${auctionKoiId}`);
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
