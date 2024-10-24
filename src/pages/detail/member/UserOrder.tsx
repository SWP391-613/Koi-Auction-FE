import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import SearchBar from "~/components/shared/SearchBar";
import { useUserData } from "~/hooks/useUserData";
import { OrderStatus, OrderWithKoiImage } from "~/types/orders.type";
import { getOrderStatusColor } from "~/utils/colorUtils";
import { getCookie } from "~/utils/cookieUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import {
  canAcceptShip,
  canConfirmOrder,
  canLeaveFeedback,
} from "~/utils/orderUtils";
import { getUserOrderByStatus } from "../../../utils/apiUtils";

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
