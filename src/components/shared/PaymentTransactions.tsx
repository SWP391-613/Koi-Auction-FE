import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { useUserData } from "~/hooks/useUserData";
import {
  PaymentResponse,
  PaymentStatus,
  PaymentType,
} from "~/types/payments.type";
import { getUserPaymentHistoryByStatus } from "~/utils/apiUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { getUserCookieToken } from "~/utils/auth.utils";
import { getPaymentStatusColor } from "~/utils/colorUtils";
import { ToastContainer } from "react-toastify";
import PaginationComponent from "../common/PaginationComponent";

const formatPaymentDate = (dateArray: number[]): string => {
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute); // month is 0-indexed in JS Date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PaymentTransactions: React.FC = () => {
  const { user } = useUserData();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 8;
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(
    PaymentStatus.ALL,
  );

  const PaymentTypeView = (paymentType: PaymentType) => {
    switch (paymentType) {
      case PaymentType.ORDER:
        return "Order Payment";
      case PaymentType.DEPOSIT:
        return "Deposit Payment";
      case PaymentType.DRAW_OUT:
        return "Draw Out Payment";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getUserPaymentHistoryByStatus(
            user.id,
            selectedStatus,
            page - 1,
            itemsPerPage,
            getUserCookieToken() || "",
          );
          setPayments(response.item);
          setTotalPages(response.total_page);
        } catch (err) {
          setError("Error fetching payments");
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user, page, selectedStatus]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleStatusChange = (status: PaymentStatus) => {
    setSelectedStatus(status);
    setPage(1);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Transactions
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {Object.values(PaymentStatus).map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "contained" : "outlined"}
            onClick={() => handleStatusChange(status)}
            sx={{ mx: 1 }}
            color={getPaymentStatusColor(status)}
          >
            {status}
          </Button>
        ))}
      </Box>

      {payments.length === 0 ? (
        <Alert severity="info">No payments found</Alert>
      ) : (
        <Paper elevation={3}>
          {payments.map((payment, index) => (
            <React.Fragment key={payment.id}>
              {index > 0 && <Divider />}
              <Box
                sx={{
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: "400px 200px 200px 200px auto",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Payment #{payment.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPaymentDate(payment.payment_date)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">
                    <strong>Method:</strong> {payment.payment_method}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong>{" "}
                    {PaymentTypeView(payment.payment_type)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">
                    <strong>Amount:</strong>{" "}
                    {formatCurrency(payment.payment_amount)}
                  </Typography>
                  {payment.order_id && (
                    <Typography variant="body2">
                      <strong>Order ID:</strong> {payment.order_id}
                    </Typography>
                  )}
                  {payment.bank_name && (
                    <Typography variant="body2">
                      <strong>Bank Name:</strong> {payment.bank_name}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ justifySelf: "flex-end" }}>
                  <Chip
                    label={payment.payment_status}
                    color={getPaymentStatusColor(payment.payment_status)}
                    size="small"
                  />
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Paper>
      )}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </Box>

      <ToastContainer />
    </Container>
  );
};

export default PaymentTransactions;
