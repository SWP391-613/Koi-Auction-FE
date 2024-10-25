import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { useUserData } from "~/hooks/useUserData";
import { PaymentResponse } from "~/types/payments.type";
// import { getPaymentsByUserId } from '~/utils/apiUtils';
import PaginationComponent from "~/components/common/PaginationComponent";
import SearchBar from "~/components/shared/SearchBar";
import { formatCurrency } from "~/utils/currencyUtils";

enum PaymentStatus {
  ALL = "ALL",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  REFUNDED = "REFUNDED",
}

const PaymentTransactions: React.FC = () => {
  const { user } = useUserData();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(
    PaymentStatus.ALL,
  );
  const [query, setQuery] = useState("");

  // useEffect(() => {
  //   const fetchPayments = async () => {
  //     if (user) {
  //       try {
  //         setLoading(true);
  //         const response = await getPaymentsByUserId(user.id, selectedStatus, page - 1, 10, query);
  //         setPayments(response.item);
  //         setTotalPages(response.total_page);
  //       } catch (err) {
  //         setError('Error fetching payments');
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchPayments();
  // }, [user, page, selectedStatus, query]);

  // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
  //   setPage(value);
  // };

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
          >
            {status}
          </Button>
        ))}
      </Box>

      <Box className="bg-gray-200 p-4 rounded-xl mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          loading={loading}
          placeholder="Search for payments..."
        />
      </Box>

      {/* <Grid container spacing={3}>
        {payments.map((payment) => (
          <Grid item xs={12} key={payment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Payment #{payment.id}</Typography>
                  <Chip label={payment.paymentStatus} color={payment.paymentStatus === 'SUCCESS' ? 'success' : 'default'} />
                </Box>
                <Typography>Amount: {formatCurrency(payment.paymentAmount)}</Typography>
                <Typography>Date: {new Date(payment.paymentDate).toLocaleString()}</Typography>
                <Typography>Method: {payment.paymentMethod}</Typography>
                <Typography>Type: {payment.paymentType}</Typography>
                {payment.orderId && <Typography>Order ID: {payment.orderId}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </Box> */}
    </Container>
  );
};

export default PaymentTransactions;
