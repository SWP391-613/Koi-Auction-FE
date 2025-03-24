import axios from "axios";
import { useQuery } from "react-query";
import { API_URL } from "~/environments/environment";
import { KoiInAuctionDetailModel } from "~/types/kois.type";
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

const urlMock = `/api_mock/kois-list-by-keyword`;

export const getKoiInAuctionData = async (): Promise<
  KoiInAuctionDetailModel[] | null
> => {
  const response = await axios.get<KoiInAuctionResponse>(
    `${API_URL.BASE}/auctionkois/get-kois-by-keyword`,
  );
  return response.data.data;
};

export const useKoiInAuction = () => {
  return useQuery({
    queryKey: ["kois-in-auction"],
    queryFn: () => getKoiInAuctionData(),
  });
};
