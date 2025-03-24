import axios from "axios";
import { useQuery } from "react-query";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ApiResponse } from "~/types/api.type";
import { AUCTION_STATUS } from "~/types/auctions.type";

// Define the type for a single auction
type AuctionItem = {
  id: number;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  end_time_countdown?: Date | string;
  status: AUCTION_STATUS | string;
  auctioneer_id: number;
};

const mockUrl = "/api_mock/auctions";
const url = `${DYNAMIC_API_URL}/auctions`;

// Now define the array type
export type AuctionModel = AuctionItem[];

export const fetchAuctions = async (page: number, limit: number) => {
  const response = await axios.get<ApiResponse<AuctionModel>>(mockUrl, {
    params: { page, limit },
  });

  return response.data.data;
};

// Add parameters to the hook or use defaults
const useAuctions = (page = 0, limit = 20) => {
  return useQuery<AuctionModel>(
    ["auctions", page, limit],
    () => fetchAuctions(page, limit),
    {
      // Optional: Add additional configurations here
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // refetchOnWindowFocus: true,
    },
  );
};

export default useAuctions;
