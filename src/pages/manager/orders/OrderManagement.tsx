import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useOrderSearch } from "~/hooks/useOrderSearch";
import SearchBar from "~/components/shared/SearchBar";
import PaginationComponent from "~/components/common/PaginationComponent";
import OrderSearchTable from "~/components/shared/OrderSearchTable";
import { OrderStatus } from "~/types/orders.type";
import { updateOrderStatus } from "~/utils/apiUtils"; // You'll need to create this function

const OrderManagement: React.FC = () => {
  const {
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
  } = useOrderSearch(500);

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      refreshOrders(); // Refresh the order list after updating
    } catch (error) {
      console.error("Failed to update order status:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Order Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {Object.values(OrderStatus).map((orderStatus) => (
          <Button
            key={orderStatus}
            variant={status === orderStatus ? "contained" : "outlined"}
            onClick={() => setStatus(orderStatus)}
            sx={{ mx: 1 }}
          >
            {orderStatus}
          </Button>
        ))}
      </Box>

      <Box className="bg-gray-200 p-4 rounded-xl mb-4">
        <Typography
          variant="h6"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          Search Orders
        </Typography>
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for orders..."
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          *Note: Search on order ID, customer name, or total amount
        </Typography>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}

      {results.length > 0 && !loading && (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Showing 1 - {results.length} of {totalItems} results.
          </Typography>

          <OrderSearchTable
            orders={results}
            status={status}
            onStatusUpdate={handleStatusUpdate}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>
      )}

      {!loading && query && results.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No results found.
        </Alert>
      )}
    </Container>
  );
};

export default OrderManagement;
