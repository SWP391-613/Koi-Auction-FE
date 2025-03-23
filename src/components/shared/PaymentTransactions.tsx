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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  PaymentResponse,
  PaymentStatus,
  PaymentType,
} from "~/types/payments.type";
import { formatCurrency } from "~/utils/currencyUtils";
import { getUserCookieToken } from "~/utils/auth.utils";
import { getPaymentStatusColor } from "~/utils/colorUtils";
import { ToastContainer } from "react-toastify";
import PaginationComponent from "../common/PaginationComponent";
import { getUserPaymentHistoryByStatus } from "~/apis/payment.apis";
import { convertDataToReadable } from "~/utils/dataConverter";
import useUserDetail from "~/hooks/useUserData";

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
  const { data: user } = useUserDetail();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 8;
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(
    PaymentStatus.ALL,
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        Payment Transactions
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          width: "100%",
        }}
      >
        <FormControl
          sx={{
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Payment Status"
            onChange={(e) =>
              handleStatusChange(e.target.value as PaymentStatus)
            }
          >
            {Object.values(PaymentStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {payments.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full">
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Empty {convertDataToReadable(selectedStatus)} payments
          </Typography>
        </div>
      ) : (
        <Paper elevation={3}>
          {payments.map((payment, index) => (
            <React.Fragment key={payment.id}>
              {index > 0 && <Divider />}
              <Box
                sx={{
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "400px 200px 200px 200px auto",
                  },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    gridColumn: { xs: "1", sm: "1 / -1", md: "auto" },
                  }}
                >
                  <Typography variant="subtitle1">
                    Payment #{payment.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPaymentDate(payment.payment_date)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: { xs: "1", sm: "auto", md: "auto" },
                  }}
                >
                  <Typography variant="body2">
                    <strong>Method:</strong> {payment.payment_method}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong>{" "}
                    {PaymentTypeView(payment.payment_type)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: { xs: "1", sm: "auto", md: "auto" },
                  }}
                >
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

                <Box
                  sx={{
                    justifySelf: { xs: "start", sm: "end" },
                    gridColumn: { xs: "1", sm: "1 / -1", md: "auto" },
                    mt: { xs: 1, sm: 2, md: 0 },
                  }}
                >
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

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          overflow: "auto",
        }}
      >
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
