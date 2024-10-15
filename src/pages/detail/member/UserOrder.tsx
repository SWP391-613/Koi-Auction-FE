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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/contexts/useUserData";
import { getCookie } from "~/utils/cookieUtils";
import {
  createOrderPayment,
  fetchUserOrders,
  updateOrder,
} from "../../../utils/apiUtils";
import EditOrderDialog from "./EditOrderDialog";
import UserOrderDetail from "./UserOrderDetail";
import PaginationComponent from "~/components/common/PaginationComponent";
import { formatCurrency } from "~/utils/currencyUtils";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import { getOrderStatusColor } from "~/utils/colorUtils";

export type Order = {
  id: number;
  first_name: string;
  last_name: string;
  total_money: number;
  phone_number: string;
  address: string;
  order_date: string;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  status: string;
  tracking_number: string;
  payment_method: string;
  note: string;
};

export type PaymentDTO = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
};

const UserOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, loading: userLoading, error: userError } = useUserData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await fetchUserOrders(
            user.id,
            getCookie("access_token") || "",
          );
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

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingOrder(null);
  };

  const handleSaveEditedOrder = async (editedOrder: Order) => {
    try {
      const updatedOrder = await updateOrder(
        editedOrder,
        getCookie("access_token") || "",
      );

      if (updatedOrder && updatedOrder.id) {
        setOrders(
          orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order,
          ),
        );
      }
      toast.success("Order updated successfully");
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const handlePayment = async (order: Order) => {
    try {
      const paymentDTO: PaymentDTO = {
        payment_amount: order.total_money,
        payment_method: order.payment_method,
        payment_type: "ORDER",
        order_id: order.id,
        user_id: user?.id || 0,
      };

      const paymentResponse = await createOrderPayment(
        paymentDTO,
        getCookie("access_token") || "",
      );

      if (paymentResponse) {
        const updatedOrder = { ...order, status: "PROCESSING" };

        setOrders(orders.map((o) => (o.id === order.id ? updatedOrder : o)));

        if (order.payment_method === "Cash") {
          toast.success("Cash payment recorded successfully");
        } else {
          if (paymentResponse.paymentUrl) {
            window.location.href = paymentResponse.paymentUrl;
          } else {
            throw new Error("No payment URL received for online payment");
          }
        }
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to process payment. Please try again.");
      }
    }
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
  if (orders.length === 0)
    return <Alert severity="info">No orders found</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
      </Box>

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
              <Box sx={{ bgcolor: theme.palette.primary.main, py: 2, px: 3 }}>
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
                    {new Date(order.order_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
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

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
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

                {order.status.toLowerCase() === "pending" && (
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      size={isMobile ? "small" : "medium"}
                      color="secondary"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOrder(order);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size={isMobile ? "small" : "medium"}
                      color="success"
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayment(order);
                      }}
                    >
                      Pay
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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedOrderId && (
          <UserOrderDetail
            orderId={selectedOrderId}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>

      <EditOrderDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        order={editingOrder}
        onSave={handleSaveEditedOrder}
        accessToken={getCookie("access_token") || ""}
      />
    </Container>
  );
};

export default UserOrder;
