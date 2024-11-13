import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import LoadingComponent from "~/components/shared/LoadingComponent";
import {
  fetchOrderDetails,
  updateOrder,
  createOrderPayment,
  getOrderById,
  confirmOrder,
} from "~/utils/apiUtils";
import {
  Order,
  OrderDetail,
  OrderStatus,
  PaymentDTO,
} from "~/types/orders.type";
import { toast, ToastContainer } from "react-toastify";
import { getCookie } from "~/utils/cookieUtils";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUserData } from "~/hooks/useUserData";
import { useMediaQuery } from "@mui/material";
import Feedback from "./Feedback";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { getUserCookieToken } from "~/utils/auth.utils";
import { koiBreeders } from "~/utils/data/koibreeders";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "~/utils/currencyUtils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";

// Create a styled Button component
const GrayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  borderColor: theme.palette.grey[300],
  "&:hover": {
    borderColor: theme.palette.grey[500],
  },
}));

// Add these new styled components at the top after imports
const OrderStatusBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const OrderSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const OrderHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ProductCard = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const UserOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const { user, loading: userLoading, error: userError } = useUserData();
  const [order, setOrder] = useState<Order | null>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const token = getUserCookieToken();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (orderId) {
      setLoading(true);

      getOrderById(parseInt(orderId))
        .then((order) => {
          setOrder(order);
        })
        .catch((err) => {
          console.error("Error fetching order:", err);
          setError("Failed to fetch order");
        });

      fetchOrderDetails(parseInt(orderId))
        .then((details) => {
          if (Array.isArray(details)) {
            setOrderDetails(details);
          } else {
            console.error("Received non-array orderDetails:", details);
            setError("Invalid order details format");
          }
        })
        .catch((err) => {
          console.error("Error fetching order details:", err);
          setError("Failed to fetch order details");
        })
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const totalOrderAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.total_money,
    0,
  );

  const handleEditOrder = () => {
    setIsEditing(true);
    setEditedOrder(order);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedOrder(null);
  };

  const handleSaveEditedOrder = async () => {
    if (!token) {
      return;
    }

    if (editedOrder) {
      try {
        const updatedOrder = await updateOrder(
          editedOrder,
          getCookie("access_token") || "",
        );

        if (updatedOrder && updatedOrder.id) {
          setOrder(updatedOrder);

          const refreshedDetails = await fetchOrderDetails(updatedOrder.id);
          setOrderDetails(refreshedDetails);
        }
        toast.success("Order updated successfully");
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order. Please try again.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePayment = async () => {
    if (order) {
      try {
        const paymentDTO: PaymentDTO = {
          payment_amount: order.total_money,
          payment_method: order.payment_method,
          payment_type: "ORDER",
          order_id: order.id,
          user_id: user?.id || 0,
          bank_number: null,
        };

        const paymentResponse = await createOrderPayment(
          paymentDTO,
          getCookie("access_token") || "",
        );

        if (paymentResponse) {
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
    }
  };

  // Add this function to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
    if (order && order.id) {
      try {
        const updatedOrder = await confirmOrder(
          order.id,
          newStatus,
          getUserCookieToken() || "",
        );
        setOrder(updatedOrder);
        toast.success(`Order status updated to ${newStatus} successfully`);
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status. Please try again.");
      }
    }
  };

  const handleOpenDialog = (action: string, message: string) => {
    setDialogAction(action);
    setDialogMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    setOpenDialog(false);
    switch (dialogAction) {
      case "payment":
        await handlePayment();
        break;
      case "delivery":
        await handleUpdateOrderStatus(OrderStatus.DELIVERED);
        break;
      case "cancel":
        await handleUpdateOrderStatus(OrderStatus.CANCELLED);
        break;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Order Status Bar */}
      {order && (
        <OrderStatusBar>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Order #{orderId}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Status:</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {order.status}
              </Typography>
            </Box>
          </Box>
        </OrderStatusBar>
      )}

      {loading && <LoadingComponent />}
      {error && <Typography color="error">{error}</Typography>}

      {order && orderDetails.length > 0 && (
        <>
          {/* Shipping Information Section */}
          <OrderSection>
            <OrderHeader>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Shipping Information
              </Typography>
            </OrderHeader>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Name:</strong> {order.first_name} {order.last_name}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {order.phone_number}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {order.shipping_address}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Order Date:</strong> {formatDate(order.order_date)}
                </Typography>
                <Typography>
                  <strong>Est. Delivery:</strong>{" "}
                  {formatDate(order.shipping_date)}
                </Typography>
                {order.note && (
                  <Typography>
                    <strong>Note:</strong> {order.note}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </OrderSection>

          {/* Products Section */}
          <OrderSection>
            <OrderHeader>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ color: "primary.main" }}>
                  <ShoppingBagIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Products
                </Typography>
                {koiBreeders.find(
                  (breeder) =>
                    breeder.id === orderDetails[0].product_id.owner_id,
                ) && (
                  <Link
                    to={`/breeder/${orderDetails[0].product_id.owner_id}/info`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<StorefrontIcon />}
                      size="small"
                    >
                      Visit Store
                    </Button>
                  </Link>
                )}
              </Box>
            </OrderHeader>

            {orderDetails.map((detail) => (
              <ProductCard key={detail.id}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: "rgb(79 146 209)",
                    borderRadius: 1,
                    mr: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={detail.product_id.thumbnail}
                    alt={detail.product_id.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {detail.product_id.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Quantity: {orderDetails.length}
                  </Typography>
                  <Typography color="primary" fontWeight="bold">
                    {formatCurrency(detail.total_money)}
                  </Typography>
                </Box>
              </ProductCard>
            ))}

            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(totalOrderAmount)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Shipping Fee:</Typography>
                <Typography>{formatCurrency(0)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(totalOrderAmount)}
                </Typography>
              </Box>
            </Box>
          </OrderSection>

          {/* Payment Section */}
          <OrderSection>
            <OrderHeader>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                <PaymentIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Payment Information
              </Typography>
            </OrderHeader>
            <Typography>
              <strong>Payment Method:</strong> {order.payment_method}
            </Typography>
            <Typography>
              <strong>Payment Status:</strong> {order.payment_status}
            </Typography>
          </OrderSection>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveEditedOrder}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {order.status === OrderStatus.PENDING && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditOrder}
                  >
                    Edit Order
                  </Button>
                )}
                {order.status === OrderStatus.PENDING && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PaymentIcon />}
                    onClick={() =>
                      handleOpenDialog(
                        "payment",
                        "Are you sure you want to process the payment for this order?",
                      )
                    }
                  >
                    Process Payment
                  </Button>
                )}
                {order &&
                  (order.status === OrderStatus.PENDING ||
                    order.status === OrderStatus.PROCESSING) && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() =>
                        handleOpenDialog(
                          "cancel",
                          "Are you sure you want to cancel this order?",
                        )
                      }
                    >
                      Cancel Order
                    </Button>
                  )}
                {order && order.status === OrderStatus.SHIPPING && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleOpenDialog(
                        "delivery",
                        "Are you sure you want to mark this order as shipped?",
                      )
                    }
                  >
                    Order Shipped
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Feedback Section */}
          {order && order.status !== "PENDING" && (
            <OrderSection sx={{ mt: 3 }}>
              <Feedback orderId={orderId || ""} />
            </OrderSection>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
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

export default UserOrderDetail;
