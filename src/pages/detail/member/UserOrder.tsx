import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  CardMedia,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/hooks/useUserData";
import { getCookie } from "~/utils/cookieUtils";
import {
  createOrderPayment,
  fetchUserOrders,
  updateOrder,
  getUserOrderByStatus,
} from "../../../utils/apiUtils";
import UserOrderDetail from "./UserOrderDetail";
import PaginationComponent from "~/components/common/PaginationComponent";
import { formatCurrency } from "~/utils/currencyUtils";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import { getOrderStatusColor } from "~/utils/colorUtils";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Link as RouterLink } from "react-router-dom";
import { Order } from "~/types/orders.type";
import { OrderStatus } from "~/types/orders.type";
import { useNavigate } from "react-router-dom";

export type PaymentDTO = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
};

// Add this type to include the Koi image
type OrderWithKoiImage = Order & {
  koi_image?: string;
};

const UserOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, loading: userLoading, error: userError } = useUserData();
  const [orders, setOrders] = useState<OrderWithKoiImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    OrderStatus.PENDING,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getUserOrderByStatus(
            user.id,
            selectedStatus,
            page - 1,
            itemsPerPage,
            getCookie("access_token") || "",
          );
          setOrders(response.orders);
          setTotalPages(response.totalPages);
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
  }, [user, page, selectedStatus]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/order-detail/${orderId}`);
  };

  const canLeaveFeedback = (order: Order) => {
    const processingDate = new Date(order.order_date);
    const currentDate = new Date();
    const daysSinceProcessing = Math.floor(
      (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
    );
    return order.status === OrderStatus.DELIVERED && daysSinceProcessing <= 7;
  };

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    setPage(1);
  };

  if (userLoading || loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <LoadingComponent />
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

  if (!user) return <Alert severity="info">No user data found</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {Object.values(OrderStatus).map((status) => (
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
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h6">
            No orders found for {selectedStatus} status
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Select a different status to view other orders
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card
                  onClick={() => handleOrderClick(order.id)}
                  sx={{
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {order.koi_image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={order.koi_image}
                      alt="Koi"
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <Box
                    sx={{ bgcolor: theme.palette.primary.main, py: 2, px: 3 }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      color="white"
                      fontWeight="bold"
                    >
                      Order #{order.id}
                    </Typography>
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography color="text.secondary" variant="body2">
                        {new Date(order.order_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </Typography>
                      <Chip
                        label={order.status}
                        color={getOrderStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <ShoppingBasketIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {order.first_name} {order.last_name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.success.main,
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <CreditCardIcon fontSize="small" />
                      </Avatar>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {formatCurrency(order.total_money)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.info.main,
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <LocalShippingIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">
                        {order.shipping_method}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.warning.main,
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <PaymentIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">
                        {order.payment_method}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.error.main,
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <HomeIcon fontSize="small" />
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {order.shipping_address}
                      </Typography>
                    </Box>

                    {canLeaveFeedback(order) && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          component={RouterLink}
                          to={`/order-detail/${order.id}`}
                          variant="contained"
                          color="primary"
                          startIcon={<FeedbackIcon />}
                        >
                          Leave Feedback
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      )}

      <ToastContainer />
    </Container>
  );
};

export default UserOrder;
