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
import { usePaymentSearch } from "~/hooks/useEntitySearch";
import SearchBar from "~/components/shared/SearchBar";
import PaginationComponent from "~/components/common/PaginationComponent";
import PaymentSearchGrid from "~/components/shared/PaymentSearchGrid";
import { PaymentStatus } from "~/types/payments.type";
import { getPaymentStatusColor } from "~/utils/colorUtils";
import { toast, ToastContainer } from "react-toastify";
import { getUserCookieToken } from "~/utils/auth.utils";
import { updatePaymentStatus } from "~/apis/payment.apis";

const PaymentManagement: React.FC = () => {
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
  } = usePaymentSearch(500);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id: number;
    newStatus: PaymentStatus;
  } | null>(null);

  const handleStatusUpdateConfirm = (
    paymentId: number,
    newStatus: PaymentStatus,
  ) => {
    setSelectedPayment({ id: paymentId, newStatus });
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (selectedPayment) {
      try {
        await updatePaymentStatus(
          selectedPayment.id,
          selectedPayment.newStatus,
          getUserCookieToken() || "",
        );
        refreshEntities();
        toast.success(`Payment status updated to ${selectedPayment.newStatus}`);
      } catch (error) {
        console.error("Failed to update payment status:", error);
        toast.error("Failed to update payment status");
      }
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={status}
            label="Payment Status"
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
          >
            {Object.values(PaymentStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="bg-gray-200 p-4 rounded-xl mb-4">
        <Typography
          variant="h6"
          sx={{ textAlign: "left", marginBottom: "1rem" }}
        >
          Search Payments
        </Typography>
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for payments..."
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "left", marginTop: "1rem" }}
          color="error"
        >
          *Note: Search on payment ID, customer name, amount, bank number,...
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

          <PaymentSearchGrid
            payments={results}
            onStatusUpdate={handleStatusUpdateConfirm}
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
            Are you sure you want to change the status of payment #
            {selectedPayment?.id} to {selectedPayment?.newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default PaymentManagement;
