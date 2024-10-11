import React, { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { fetchUserOrders, fetchOrderDetails } from "../../utils/apiUtils";
import { useUserData } from "~/contexts/useUserData";
import PaginationComponent from "~/components/pagination/Pagination";
import UserOrderDetail from "./UserOrderDetail";

export type Order = {
  id: number;
  firstName: string;
  lastName: string;
  totalPrice: number;
  address: string;
  orderDate: string;
  shippingMethod: string;
  shippingAddress: string;
  shippingDate: string;
  status: string;
  trackingNumber: string;
};

const UserOrder = () => {
  const { user, loading: userLoading, error: userError } = useUserData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await fetchUserOrders(user.id);
          setOrders(
            response.slice((page - 1) * itemsPerPage, page * itemsPerPage),
          );
          setTotalPages(Math.ceil(response.length / itemsPerPage));
        } catch (err) {
          setError("Error fetching orders");
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleOrderClick = async (orderId: number) => {
    try {
      const orderDetails = await fetchOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setDialogOpen(true);
    } catch (err) {
      setError("Error fetching order details");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  if (userLoading || loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (userError || error) {
    return (
      <Container>
        <Alert severity="error">{userError || error}</Alert>
      </Container>
    );
  }

  if (!user) return <div>No user data found</div>;
  if (orders.length === 0) return <div>No orders found</div>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card
              onClick={() => handleOrderClick(order.id)}
              sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  Order #{order.id}
                </Typography>
                <Typography color="text.secondary">
                  Date: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Total: ${order.totalPrice}
                </Typography>
                <Typography variant="body2">Status: {order.status}</Typography>
                <Typography variant="body2">
                  Shipping: {order.shippingMethod}
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(order.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="mt-6">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <UserOrderDetail order={selectedOrder} onClose={handleCloseDialog} />
        )}
      </Dialog>
    </Container>
  );
};

export default UserOrder;
