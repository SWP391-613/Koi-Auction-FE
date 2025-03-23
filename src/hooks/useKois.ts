import axios from "axios";
import { useQuery } from "react-query";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { ApiResponse } from "~/types/api.type";
import { KoiInAuctionResponse } from "~/types/paginated.types";

// export const getKoiInAuctionData = async (
//   keyword: string,
//   page: number,
//   limit: number,
// ): Promise<KoiInAuctionResponse | void> => {
//   const response = await axios.get<KoiInAuctionResponse>(
//     `${DYNAMIC_API_URL}/auctionkois/get-kois-by-keyword`,
//     {
//       params: {
//         keyword: keyword,
//         page: page - 1, // Assuming the API is zero-based
//         limit,
//       },
//     },
//   );
//   return response.data;
// };

export const getKoiInAuctionData =
  async (): Promise<KoiInAuctionResponse | void> => {
    const response = await axios.get<ApiResponse<KoiInAuctionResponse>>(
      `/api_mock/kois-list-by-keyword`,
    );
    return response.data.data;
  };

export const useKoiInAuction = () => {
  return useQuery({
    queryKey: ["kois-in-auction"],
    queryFn: () => getKoiInAuctionData(),
  });
};
