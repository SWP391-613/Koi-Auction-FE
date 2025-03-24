import { http, HttpResponse } from "msw";
import { ApiResponse } from "~/types/api.type";
import { AuctionModel } from "~/types/auctions.type";

const getAllAuction_Pag_Res = {
  message: "Get all auctions successfully",
  data: [
    {
      id: 14,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 13,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 12,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 11,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 10,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 9,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 8,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 7,
      title: "Auction 123",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 6,
      title: "Auction 1",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 5,
      title: "Auction 1",
      start_time: "2025-05-31 23:59:59.999999",
      end_time: "2025-08-31 23:59:59.999999",
      status: "UPCOMING",
      auctioneer_id: 22,
    },
    {
      id: 4,
      title: "Decs Auction Test",
      start_time: "2024-10-15 16:50:00.000000",
      end_time: "2024-10-17 16:50:00.000000",
      status: "ENDED",
      auctioneer_id: 21,
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
      id: 2,
      title: "Sealed Price Auction",
      start_time: "2024-10-06 14:41:38.679000",
      end_time: "2024-10-30 14:41:38.679000",
      status: "ENDED",
      auctioneer_id: 23,
    },
    {
      id: 1,
      title: "Fixed Price Auction",
      start_time: "2024-10-06 14:41:38.679000",
      end_time: "2024-10-30 14:41:38.679000",
      status: "ENDED",
      auctioneer_id: 23,
    },
  ],
  pagination: {
    total_pages: 1,
    total_items: 14,
    current_page: 0,
    page_size: 30,
  },
  status_code: 200,
  is_success: true,
};

export const getAllAuction_Pag_Req = () => {
  return http.get(`/api_mock/auctions`, () => {
    return HttpResponse.json<ApiResponse<AuctionModel[]>>(
      getAllAuction_Pag_Res,
    );
  });
};

export const getAllAuction_ByKeyWord_Pag_Req = () => {
  return http.get(`/api_mock/auctions`, () => {
    return HttpResponse.json<ApiResponse<AuctionModel[]>>(
      getAllAuction_Pag_Res,
    );
  });
};
