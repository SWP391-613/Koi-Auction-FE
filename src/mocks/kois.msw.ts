import { http, HttpResponse } from "msw";

const getKoiList_ByKeyWord_Res = {
  message: "Find all koi by keyword successfully",
  data: [
    {
      id: 13,
      name: "Dark Ochiba",
      sex: "FEMALE",
      length: 23,
      year_born: 1,
      base_price: 762,
      status_name: "VERIFIED",
      is_display: 1,
      thumbnail:
        "https://mjjlqhnswgbzvxfujauo.supabase.co/storage/v1/object/public/auctions/3/photos/Shinoda%20Dark%20Ochiba%2023cm%20tosai.png",
      description: "A beautiful Dark Ochiba koi",
      owner_id: 26,
      category_id: 7,
      auction_id: 6,
      bid_method: "DESCENDING_BID",
    },
    {
      id: 15,
      name: "Ginrin Showa",
      sex: "FEMALE",
      length: 21,
      year_born: 1,
      base_price: 392,
      status_name: "VERIFIED",
      is_display: 1,
      thumbnail:
        "https://mjjlqhnswgbzvxfujauo.supabase.co/storage/v1/object/public/auctions/3/photos/Shinoda%20Ginrin%20Showa%20tosai%2021cm.png",
      description: "A beautiful Ginrin Showa koi",
      owner_id: 24,
      category_id: 3,
      auction_id: 6,
      bid_method: "DESCENDING_BID",
    },
    {
      id: 16,
      name: "Hi Utsuri",
      sex: "FEMALE",
      length: 33,
      year_born: 1,
      base_price: 661,
      status_name: "VERIFIED",
      is_display: 1,
      thumbnail:
        "https://mjjlqhnswgbzvxfujauo.supabase.co/storage/v1/object/public/auctions/3/photos/Shinoda%20Hi%20Utsuri%2033cm.png",
      description: "A beautiful Hi Utsuri koi",
      owner_id: 32,
      category_id: 4,
      auction_id: 6,
      bid_method: "DESCENDING_BID",
    },
    {
      id: 18,
      name: "Ginrin Kohaku",
      sex: "FEMALE",
      length: 18,
      year_born: 1,
      base_price: 50,
      status_name: "VERIFIED",
      is_display: 1,
      thumbnail:
        "https://mjjlqhnswgbzvxfujauo.supabase.co/storage/v1/object/public/auctions/3/photos/Torazo%20Ginrin%20Kohaku%2018cm.png",
      description: "A beautiful Ginrin Kohaku koi",
      owner_id: 25,
      category_id: 1,
      auction_id: 7,
      bid_method: "DESCENDING_BID",
    },
  ],
  pagination: {
    total_pages: 1,
    total_items: 4,
    current_page: 0,
    page_size: 12,
  },
  status_code: 200,
  is_success: true,
};

export const getKoiListByKeyWord_Req = () => {
  return http.get("/api_mock/auctionkois/get-kois-by-keyword", () => {
    return HttpResponse.json(getKoiList_ByKeyWord_Res);
  });
};
