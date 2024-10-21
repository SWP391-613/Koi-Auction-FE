import { AuctionModel } from "~/types/auctions.type";
import { useSearch } from "./useSearch";

export const useAuctionSearch = (debounceTime = 500) => {
  return useSearch<AuctionModel>({
    apiUrl: "http://localhost:4000/api/v1/auctions/get-auctions-by-keyword",
    requiresAuth: false,
    preload: true,
    defaultQuery: "ongoing",
    debounceTime,
  });
};
