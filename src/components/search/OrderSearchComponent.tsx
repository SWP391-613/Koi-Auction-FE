import { Typography, Button, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useOrderSearch } from "~/hooks/useOrderSearch";
import PaginationComponent from "../common/PaginationComponent";
import SearchBar from "../shared/SearchBar";
import { OrderStatus } from "~/types/orders.type";
import OrderSearchTable from "../shared/OrderSearchTable";

interface OrderSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const OrderSearchComponent: React.FC<OrderSearchComponentProps> = ({
  onSearchStateChange,
}) => {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    handlePageChange,
    setCustomParams,
  } = useOrderSearch(500);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    setCustomParams({ status: newStatus });
  };

  useEffect(() => {
    onSearchStateChange(query.length > 0);
  }, [query, onSearchStateChange]);

  return (
    <div className="container mx-auto p-4 mt-5">
      <div className="flex items-center space-x-4 mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for orders..."
        />
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {Object.values(OrderStatus).map((orderStatus) => (
          <Button
            key={orderStatus}
            variant={status === orderStatus ? "contained" : "outlined"}
            onClick={() => handleStatusChange(orderStatus)}
            sx={{ mx: 1 }}
          >
            {orderStatus}
          </Button>
        ))}
      </Box>
      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {results.length > 0 && !loading && (
        <>
          <Typography variant="body2" className="mt-3 mb-3">
            Total Items: {totalItems}
          </Typography>

          <OrderSearchTable orders={results} />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default OrderSearchComponent;
