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
import axios from "axios";
import { getUserCookieToken } from "~/utils/auth.utils";
import KoiBreederSearchGrid from "~/components/shared/KoiBreederSearchGrid";
import SearchBar from "~/components/shared/SearchBar";

export type PaymentDTO = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
};

export type OrderOfUser = {
  item: Order[];
  total_page: number;
  total_item: number;
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
    OrderStatus.ALL,
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
          setOrders(response.item);
          setTotalPages(response.total_page);
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
    navigate(`order-detail/${orderId}`);
  };

  const canLeaveFeedback = (order: Order) => {
    const processingDate = new Date(order.order_date);
    const currentDate = new Date();
    const daysSinceProcessing = Math.floor(
      (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
    );
    return order.status === OrderStatus.DELIVERED && daysSinceProcessing <= 7;
  };

  const canAcceptShip = (order: Order) => {
    const processingDate = new Date(order.shipping_date);
    const currentDate = new Date();
    const daysSinceProcessing = Math.floor(
      (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
    );
    return order.status === OrderStatus.SHIPPED && daysSinceProcessing <= 7;
  };

  const canConfirmOrder = (order: Order) => {
    const processingDate = new Date(order.shipping_date);
    const currentDate = new Date();
    const daysSinceProcessing = Math.floor(
      (currentDate.getTime() - processingDate.getTime()) / (1000 * 3600 * 24),
    );
    return order.status === OrderStatus.PENDING && daysSinceProcessing <= 7;
  };

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    setPage(1);
  };

  if (userLoading || loading) {
    return <LoadingComponent />;
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
    <div className="">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {Object.values(OrderStatus).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "contained" : "outlined"}
              onClick={() => handleStatusChange(status)}
              sx={{ mx: 1 }}
              color={getOrderStatusColor(status)}
            >
              {status}
            </Button>
          ))}
        </Box>
      </Box>

      {orders.length === 0 ? (
        <div className="flex justify-center">
          <Typography variant="h6">Empty {selectedStatus} order</Typography>
        </div>
      ) : (
        <>
          <SearchBar
            value={""}
            onChange={() => {}}
            loading={false}
            placeholder="Search for orders..."
          ></SearchBar>
          {orders.map((order) => (
            <Card
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                marginBottom: 2,
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
                    justifyContent: "end",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  Status:
                  <Chip
                    label={order.status}
                    color={getOrderStatusColor(order.status)}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />
                <div className="flex justify-between">
                  <div>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        Name: {order.first_name} {order.last_name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2">
                        Shipping Method: {order.shipping_method}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2">
                        Payment Method: {order.payment_method}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                    >
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
                        Shipping Address: {order.shipping_address}
                      </Typography>
                    </Box>
                  </div>

                  <Box sx={{ display: "flex", alignItems: "end", mb: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(order.total_money)}
                    </Typography>
                  </Box>
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    Order Created At:{" "}
                    {new Date(order.order_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                {canConfirmOrder(order) && (
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
                      startIcon={<EditIcon />}
                    >
                      Confirm Order
                    </Button>
                  </Box>
                )}

                {canAcceptShip(order) && (
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
                      startIcon={<LocalShippingIcon />}
                    >
                      SHIPPED!
                    </Button>
                  </Box>
                )}

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
          ))}

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
    </div>
  );
};

export default UserOrder;
