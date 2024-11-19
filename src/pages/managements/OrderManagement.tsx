import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useOrderSearch } from "~/hooks/useEntitySearch";
import SearchBar from "~/components/shared/SearchBar";
import PaginationComponent from "~/components/common/PaginationComponent";
import OrderSearchGrid from "~/components/shared/OrderSearchGrid";
import { OrderStatus } from "~/types/orders.type";
import { getOrderStatusColor } from "~/utils/colorUtils";
import { toast } from "react-toastify";
import { getUserCookieToken } from "~/utils/auth.utils";
import { updateOrderStatus } from "~/apis/order.apis";

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
    refreshEntities,
  } = useOrderSearch(500);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: number;
    newStatus: OrderStatus;
  } | null>(null);

  const handleStatusUpdateConfirm = (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    setSelectedOrder({ id: orderId, newStatus });
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(
          selectedOrder.id,
          selectedOrder.newStatus,
          getUserCookieToken() || "",
        );
        refreshEntities();
        toast.success(`Order status updated to ${selectedOrder.newStatus}`);
      } catch (error) {
        console.error("Failed to update order status:", error);
        toast.error("Failed to update order status");
      }
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    setSelectedOrder({ id: orderId, newStatus });
    setOpenDialog(true);
  };

  const handleUpdateKoiOwnerAccount = (orderId: number) => {
    // This function will be implemented later
    console.log(`Update Koi Owner Account for order ${orderId}`);
    toast.info(
      "Koi Owner Account update functionality will be implemented soon",
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={status}
              label="Order Status"
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
            >
              {Object.values(OrderStatus).map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  sx={{
                    color: getOrderStatusColor(status),
                  }}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
          *Note: Search on customer name, address, phone number,...
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

          <OrderSearchGrid
            orders={results}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change the status of order #
            {selectedOrder?.id} to {selectedOrder?.newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
