import { http, HttpResponse } from "msw";
import { ApiResponse } from "~/types/api.type";
import { AuctionModel } from "~/types/auctions.type";

const getAllAuction_Pag_Res = {
  message: "Get all auctions successfully",
  data: [
    {
      id: 1,
      title: "Fixed Price Auction",
      start_time: "2024-10-06 14:41:38.679000",
      end_time: "2024-10-30 14:41:38.679000",
      status: "ENDED",
      auctioneer_id: 23,
    },
    {
      id: 2,
      title: "Sealed Price Auction",
      start_time: "2024-10-06 14:41:38.679000",
      end_time: "2024-10-30 14:41:38.679000",
      status: "ENDED",
      auctioneer_id: 23,
    },
    {
      id: 3,
      title: "Test Auction",
      start_time: "2024-10-15 14:35:00.000000",
      end_time: "2024-10-17 14:35:00.000000",
      status: "ENDED",
      auctioneer_id: 21,
    },
    {
      id: 4,
      title: "Decs Auction Test",
      start_time: "2024-10-15 16:50:00.000000",
      end_time: "2024-10-17 16:50:00.000000",
      status: "ENDED",
      auctioneer_id: 21,
    },
  ],
  pagination: {
    total_pages: 1,
    total_items: 4,
    current_page: 0,
    page_size: 10,
  },
  status_code: 200,
  is_success: true,
};

export const getAllAuction_Pag_Req = () => {
  return http.get(`/mock_api/auctions?page=0&limit=18`, () => {
    return HttpResponse.json<ApiResponse<AuctionModel[]>>(
      getAllAuction_Pag_Res,
    );
  });
};

export const getAllAuction_ByKeyWord_Pag_Req = () => {
  return http.get(
    `/mock_api/get-auctions-by-keyword?keyword=&page=0&limit=30`,
    () => {
      return HttpResponse.json<ApiResponse<AuctionModel[]>>(
        getAllAuction_Pag_Res,
      );
    },
  );
};
