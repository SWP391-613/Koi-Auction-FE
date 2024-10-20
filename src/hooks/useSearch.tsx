import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "@mui/material";
import { KoiInAuctionDetailModel, KoiSearchResult } from "~/types/kois.type";

export const useKoiSearch = (debounceTime = 300) => {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<KoiInAuctionDetailModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  const searchApi = useCallback(
    async (searchQuery: string, currentPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<KoiSearchResult>(
          "http://localhost:4000/api/v1/auctionkois/get-kois-by-keyword",
          {
            params: {
              keyword: searchQuery,
              page: currentPage,
              limit: limit,
            },
          },
        );
        setResults(response.data.item);
        setTotalPages(response.data.total_page);
        setTotalItems(response.data.total_item);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [],
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
};
