import { useState, useCallback } from "react";
import { Order, OrderStatus } from "~/types/orders.type";
import { useSearch } from "./useSearch";

export const useOrderSearch = (debounceTime = 300) => {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  const searchHook = useSearch<Order>({
    apiUrl:
      "http://localhost:4000/api/v1/orders/get-orders-by-keyword-and-status",
    requiresAuth: true,
    debounceTime,
    defaultParams: { status: status },
  });

  const setCustomParams = useCallback(
    (params: { status: OrderStatus }) => {
      setStatus(params.status);
      searchHook.setCustomParams({ status: params.status });
    },
    [searchHook],
  );

  return {
    ...searchHook,
    setCustomParams,
    status,
  };
};
