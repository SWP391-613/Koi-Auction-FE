import { debounce } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuctionModel } from "~/types/auctions.type";
import { KoiDetailModel, KoiInAuctionDetailModel } from "~/types/kois.type";
import { getUserCookieToken } from "~/utils/auth.utils";

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
  transformResponse?: (data: any) => SearchResult<T>;
  preload?: boolean;
  defaultQuery?: string;
}

export function useSearch<T>({
  apiUrl,
  debounceTime = 500,
  limit = 8,
  requiresAuth = false,
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
    [apiUrl, limit, requiresAuth, transformResponse],
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

  return {
    query,
    setQuery,
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
    apiUrl: "http://localhost:4000/api/v1/kois/get-kois-owner-by-keyword",
    requiresAuth: true,
    preload: true,
    defaultQuery: "ya",
    debounceTime,
  });
};

export const useAllKoiSearch = (debounceTime = 500) => {
  return useSearch<KoiDetailModel>({
    apiUrl: "http://localhost:4000/api/v1/kois/get-all-kois-by-keyword",
    requiresAuth: true,
    preload: false,
    debounceTime,
  });
};

//in page breeder detail call this hook, to their get koi by keyword
export const useKoiUnverifiedSearch = (debounceTime = 500) => {
  return useSearch<KoiDetailModel>({
    apiUrl: "http://localhost:4000/api/v1/kois/get-unverified-kois-by-keyword",
    requiresAuth: true,
    preload: true,
    defaultQuery: "ya",
    debounceTime,
  });
};

export const useKoiInAuctionSearch = (debounceTime = 500) => {
  return useSearch<KoiInAuctionDetailModel>({
    apiUrl: "http://localhost:4000/api/v1/auctionkois/get-kois-by-keyword",
    requiresAuth: false,
    preload: true,
    defaultQuery: "ko",
    debounceTime: debounceTime,
  });
};

export const useAuctionSearch = (debounceTime = 500) => {
  return useSearch<AuctionModel>({
    apiUrl: "http://localhost:4000/api/v1/auctions/get-auctions-by-keyword",
    requiresAuth: false,
    preload: true,
    defaultQuery: "ongoing",
    debounceTime,
  });
};
