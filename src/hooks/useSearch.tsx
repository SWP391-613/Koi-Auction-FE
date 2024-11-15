import { debounce } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "~/constants/endPoints";
import { AuctionModel } from "~/types/auctions.type";
import { KoiDetailModel, KoiInAuctionDetailModel } from "~/types/kois.type";
import { OrderResponse } from "~/types/orders.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { getCookie } from "~/utils/cookieUtils";

interface SearchResult<T> {
  item: T[];
  total_page: number;
  total_item: number;
}

interface SearchHookOptions<T> {
  apiUrl: string;
  debounceTime?: number;
  limit?: number;
  requiresAuth?: boolean;
  owner_id?: number;
  transformResponse?: (data: any) => SearchResult<T>;
  preload?: boolean;
  defaultQuery?: string;
}

export function useSearch<T>({
  apiUrl,
  debounceTime = 500,
  limit = 8,
  requiresAuth = false,
  owner_id,
  transformResponse = (data) => data,
  preload = false,
  defaultQuery = "",
}: SearchHookOptions<T>) {
  const [query, setQueryState] = useState(defaultQuery);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const initialLoadDone = useRef(false);

  const searchApi = useCallback(
    async (searchQuery: string, currentPage: number) => {
      setLoading(true);
      setError(null);

      try {
        let headers = {};
        if (requiresAuth) {
          const userToken = getUserCookieToken();
          if (!userToken) {
            throw new Error("Authentication token is required for this search");
          }
          headers = { Authorization: `Bearer ${userToken}` };
        }

        const response = await axios.get<SearchResult<T>>(apiUrl, {
          params: {
            keyword: searchQuery,
            page: currentPage,
            limit: limit,
            owner_id: owner_id || undefined, //only send owner_id if it's provided
          },
          headers: headers,
        });
        const transformedData = transformResponse(response.data);
        setResults(transformedData.item);
        setTotalPages(transformedData.total_page);
        setTotalItems(transformedData.total_item);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, limit, requiresAuth, transformResponse, owner_id],
  );

  const debouncedSearch = useCallback(
    debounce((q: string) => {
      if (q) {
        searchApi(q, 0);
        setPage(0);
      } else {
        setResults([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    }, debounceTime),
    [searchApi, debounceTime],
  );

  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch],
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    searchApi(query, value - 1);
  };

  // Preload data on mount if `preload` is true and it hasn't been done before
  useEffect(() => {
    if (preload && !initialLoadDone.current) {
      searchApi(defaultQuery, 0);
      initialLoadDone.current = true;
    }
  }, [preload, defaultQuery, searchApi]);

  // Memoize the results to avoid re-fetching data
  const memoizedResults = useMemo(() => {
    return {
      results,
      totalPages,
      totalItems,
    };
  }, [results, totalPages, totalItems]);

  return {
    query,
    setQuery,
    ...memoizedResults,
    results,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    handlePageChange,
  };
}

//in page breeder detail call this hook, to their get koi by keyword
export const useKoiOwnerSearch = (debounceTime = 500) => {
  return useSearch<KoiDetailModel>({
    apiUrl: `${API_URL}/kois/get-kois-owner-by-keyword`,
    requiresAuth: true,
    preload: true,
    defaultQuery: "",
    debounceTime,
  });
};

export const useKoiOwnerSearchNotAuth = (
  owner_id: number,
  debounceTime = 500,
) => {
  return useSearch<KoiDetailModel>({
    apiUrl: `${API_URL}/kois/get-kois-owner-by-keyword-not-auth`,
    requiresAuth: false,
    preload: true,
    defaultQuery: "",
    debounceTime,
    owner_id,
  });
};

export const useAllKoiSearch = (debounceTime = 500) => {
  return useSearch<KoiDetailModel>({
    apiUrl: `${API_URL}/kois/get-all-kois-by-keyword`,
    requiresAuth: true,
    preload: false,
    debounceTime,
  });
};

//in page breeder detail call this hook, to their get koi by keyword
export const useKoiUnverifiedSearch = (debounceTime = 500) => {
  return useSearch<KoiDetailModel>({
    apiUrl: `${API_URL}/kois/get-unverified-kois-by-keyword`,
    requiresAuth: true,
    preload: true,
    defaultQuery: "",
    debounceTime,
  });
};

export const useKoiInAuctionSearch = (debounceTime = 500) => {
  return useSearch<KoiInAuctionDetailModel>({
    apiUrl: `${API_URL}/auctionkois/get-kois-by-keyword`,
    limit: 12,
    requiresAuth: false,
    preload: true,
    defaultQuery: "",
    debounceTime,
  });
};

export const useAuctionSearch = (debounceTime = 500) => {
  return useSearch<AuctionModel>({
    apiUrl: `${API_URL}/auctions/get-auctions-by-keyword`,
    limit: 30,
    requiresAuth: false,
    preload: true,
    defaultQuery: "",
    debounceTime,
  });
};

export const useAuctionUpComingSearch = (debounceTime = 500) => {
  return useSearch<AuctionModel>({
    apiUrl: `${API_URL}/auctions/get-auctions-by-keyword`,
    requiresAuth: true,
    preload: true,
    defaultQuery: "upcoming",
    debounceTime,
  });
};

export const useUserOrderSearch = (debounceTime = 500) => {
  return useSearch<OrderResponse>({
    apiUrl: `${API_URL}/orders/search-user-orders-by-keyword`,
    requiresAuth: true,
    preload: false,
    debounceTime,
  });
};
