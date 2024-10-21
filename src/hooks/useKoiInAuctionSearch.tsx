import { KoiInAuctionDetailModel } from "~/types/kois.type";
import { useSearch } from "./useSearch";

export const useKoiInAuctionSearch = (debounceTime = 300) => {
  return useSearch<KoiInAuctionDetailModel>({
    apiUrl: "http://localhost:4000/api/v1/auctionkois/get-kois-by-keyword",
    requiresAuth: false,
    preload: true,
    defaultQuery: "a",
    debounceTime: debounceTime,
  });
};
