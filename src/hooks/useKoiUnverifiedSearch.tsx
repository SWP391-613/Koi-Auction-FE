import { KoiDetailModel } from "~/types/kois.type";
import { useSearch } from "./useSearch";

//in page breeder detail call this hook, to their get koi by keyword
export const useKoiUnverifiedSearch = (debounceTime = 300) => {
  return useSearch<KoiDetailModel>({
    apiUrl: "http://localhost:4000/api/v1/kois/get-unverified-kois-by-keyword",
    requiresAuth: true,
  });
};
