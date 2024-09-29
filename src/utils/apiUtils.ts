import axios from "axios";
import { environment } from "../environments/environment";
import { AuctionKoi } from "~/pages/auctions/AuctionDetail";
import { RegisterDTO } from "~/dtos/register.dto";
import { LoginDTO, LoginResponse } from "~/dtos/login.dto";
import { KoiDetailModel, KoisResponse } from "~/pages/kois/Kois";
import { Auction } from "~/pages/auctions/Auctions";
import { AuctionKoiResponse } from "~/pages/auctions/KoiBidding";
import { Bid } from "~/components/BiddingHistory";

const API_URL = `${environment.be.baseUrl}${environment.be.apiPrefix}`;

export const login = async (payload: LoginDTO): Promise<LoginResponse> => {
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

export const fetchGoogleClientId = async () => {
  try {
    const response = await axios.get(`${API_URL}/oauth2/google-client-id`);
    return response.data.clientId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Google client ID:",
        error.response?.data?.message || error.message,
      );
    } else {
      console.error(
        "Error fetching Google client ID:",
        "An unexpected error occurred",
      );
    }
    return null;
  }
};

const convertTimeArrayToDate = (
  timeArray: [number, number, number, number, number, number, number],
): Date => {
  return new Date(Date.UTC(...timeArray));
};

const createAuctionFromApi = (apiData: any): Auction => {
  return {
    id: apiData.id,
    title: apiData.title,
    start_time: convertTimeArrayToDate(apiData.start_time),
    end_time: convertTimeArrayToDate(apiData.end_time),
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
    const auctions: Auction[] = response.data.map(createAuctionFromApi);
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
  koiId: number,
): Promise<AuctionKoiResponse> => {
  const response = await fetch(`${API_URL}/auctionkois/${auctionId}/${koiId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch auction koi details");
  }
  return response.json();
};

export const fetchBidHistory = async (auctionKoiId: number): Promise<any[]> => {
  const response = await fetch(`${API_URL}/auctionkoidetails/${auctionKoiId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bid history");
  }
  return response.json();
};

export const placeBid = async (
  auctionId: number,
  koiId: number,
  amount: number,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/auctions/${auctionId}/koi/${koiId}/bid`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers here if required
      },
      body: JSON.stringify({ amount }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to place bid");
  }
};

export const fetchBiddingHistory = async (
  auctionKoiId: number,
): Promise<Bid[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/auctionkoidetails/${auctionKoiId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bidding history:", error);
    throw new Error("Failed to fetch bidding history");
  }
};
