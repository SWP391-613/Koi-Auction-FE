import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { getUserCookieToken } from "~/utils/auth.utils";
import { OrderResponse, OrderStatus } from "~/types/orders.type";
import { PaymentResponse, PaymentStatus } from "~/types/payments.type";

interface SearchResult<T> {
  item: T[];
  total_page: number;
  total_item: number;
}

interface SearchParams<StatusType> {
  keyword: string;
  status: StatusType;
  page: number;
  limit: number;
}

interface UseEntitySearchProps<T, StatusType> {
  endpoint: string;
  initialStatus: StatusType;
  debounceTime?: number;
}

export const useEntitySearch = <T, StatusType>({
  endpoint,
  initialStatus,
  debounceTime = 500,
}: UseEntitySearchProps<T, StatusType>) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusType>(initialStatus);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const searchEntities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userToken = getUserCookieToken();
      if (!userToken) {
        throw new Error("Authentication token is required for this search");
      }

      const params: SearchParams<StatusType> = {
        keyword: query,
        status: status,
        page: page - 1,
        limit: 10,
      };

      const response = await axios.get<SearchResult<T>>(endpoint, {
        params,
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setResults(response.data.item);
      setTotalPages(response.data.total_page);
      setTotalItems(response.data.total_item);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [query, status, page, endpoint]);

  useEffect(() => {
    const handler = setTimeout(() => {
      searchEntities();
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchEntities, debounceTime]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const refreshEntities = useCallback(() => {
    searchEntities();
  }, [searchEntities]);

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
    refreshEntities,
  };
};

export const useOrderSearch = (debounceTime = 500) => {
  return useEntitySearch<OrderResponse, OrderStatus>({
    endpoint:
      "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/orders/get-orders-by-keyword-and-status",
    initialStatus: OrderStatus.ALL,
    debounceTime,
  });
};

export const usePaymentSearch = (debounceTime = 500) => {
  return useEntitySearch<PaymentResponse, PaymentStatus>({
    endpoint:
      "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/payments/get-payments-by-keyword-and-status",
    initialStatus: PaymentStatus.ALL,
    debounceTime,
  });
};
