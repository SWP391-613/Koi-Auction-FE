import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface UsePaginationProps<T> {
  apiUrl: string;
  itemsPerPage: number;
  accessToken: string | null;
}

interface PaginatedResponse<T> {
  item: T[];
  total_page: number;
}

function usePagination<T>({
  apiUrl,
  itemsPerPage,
  accessToken,
}: UsePaginationProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Create a function to fetch the paginated data
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get<PaginatedResponse<T>>(apiUrl, {
        params: {
          page: page - 1,
          limit: itemsPerPage,
        },
        headers, // Pass headers conditionally
      });

      const data = response.data;

      if (data && Array.isArray(data.item)) {
        setItems(data.item);
        setTotalPages(data.total_page);
        setError(null); // Reset error state on successful fetch
      } else {
        setError("Error fetching items");
      }
    } catch (err) {
      setError("Error fetching items");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, itemsPerPage, accessToken]);

  // Trigger fetching of items on page change or when refetch is called
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  // Return items, pagination data, and the refetch function
  return {
    items,
    loading,
    error,
    page,
    totalPages,
    handlePageChange,
    refetch: fetchItems,
  };
}

export default usePagination;
