import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Order, OrderStatus } from "~/types/orders.type";
import { getUserCookieToken } from "~/utils/auth.utils";

interface OrderSearchResult {
  item: Order[];
  total_page: number;
  total_item: number;
}

export const useOrderSearch = (debounceTime = 500) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [results, setResults] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const searchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userToken = getUserCookieToken();
      if (!userToken) {
        throw new Error("Authentication token is required for this search");
      }

      const response = await axios.get<OrderSearchResult>(
        "http://localhost:4000/api/v1/orders/get-orders-by-keyword-and-status",
        {
          params: {
            keyword: query,
            status: status,
            page: page - 1,
            limit: 10,
          },
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );

      setResults(response.data.item);
      setTotalPages(response.data.total_page);
      setTotalItems(response.data.total_item);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [query, status, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      searchOrders();
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchOrders, debounceTime]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const refreshOrders = useCallback(() => {
    searchOrders();
  }, [searchOrders]);

  return {
    query,
    setQuery,
    status,
    setStatus,
    results,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    handlePageChange,
    refreshOrders,
  };
};
