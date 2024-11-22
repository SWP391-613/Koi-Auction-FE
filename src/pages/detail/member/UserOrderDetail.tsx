import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
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
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { Order, OrderDetail, OrderStatus } from "~/types/orders.type";
import { PaymentDTO } from "~/types/payments.type";
import { toast, ToastContainer } from "react-toastify";
import { getCookie } from "~/utils/cookieUtils";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import { useUserData } from "~/hooks/useUserData";
import { useMediaQuery } from "@mui/material";
import Feedback from "./Feedback";

import { getUserCookieToken } from "~/utils/auth.utils";
import { koiBreeders } from "~/utils/data/koibreeders";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "~/utils/currencyUtils";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { ShippingInformation } from "./components/ShippingInformation";
import { SHIPPING_PRICES } from "~/types/shipping.types";
import {
  confirmOrder,
  fetchOrderDetails,
  getOrderById,
  updateOrder,
} from "~/apis/order.apis";
import { createOrderPayment } from "~/apis/payment.apis";

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

// Add these interfaces after your existing imports

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

  const token = getUserCookieToken() || "";

  // Add new state for temporary order changes
  const [tempOrderUpdates, setTempOrderUpdates] = useState<Partial<Order>>({});

  useEffect(() => {
    if (!token) {
      return;
    }

    if (orderId) {
      setLoading(true);
      setError(null);

      Promise.all([
        getOrderById(parseInt(orderId)),
        fetchOrderDetails(parseInt(orderId)),
      ])
        .then(([orderData, details]) => {
          if (orderData) {
            setOrder(orderData);
          } else {
            throw new Error("Failed to fetch order");
          }

          if (Array.isArray(details)) {
            setOrderDetails(details);
          } else {
            throw new Error("Invalid order details format");
          }
        })
        .catch((err) => {
          console.error("Error fetching order data:", err);
          setError(err.message || "Failed to fetch order data");
          toast.error("Failed to load order information");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, token, navigate]);

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
          bank_name: null,
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
      case "save":
        try {
          const orderToUpdate = {
            ...order,
            ...tempOrderUpdates,
            total_money: calculateTotal(order as Order, tempOrderUpdates),
          };

          setLoading(true);
          const updated = await updateOrder(orderToUpdate as Order, token);

          if (updated) {
            setOrder(updated);
            setTempOrderUpdates({});

            toast.success("Order saved successfully");

            try {
              const refreshedDetails = await fetchOrderDetails(updated.id);
              if (Array.isArray(refreshedDetails)) {
                setOrderDetails(refreshedDetails);
              }
            } catch (refreshError) {
              console.error("Error refreshing details:", refreshError);
            }
          } else {
            throw new Error("Failed to update order");
          }
        } catch (error) {
          console.error("Error saving order:", error);
          toast.error(
            `Failed to save order changes, ${error.response.data.phoneNumber}.`,
          );
          setError("Failed to save order changes");
        } finally {
          setLoading(false);
        }
        break;
    }
  };

  const handleUpdateShipping = (updatedOrder: Order) => {
    if (
      updatedOrder.shipping_address === undefined ||
      updatedOrder.phone_number === undefined
    ) {
      toast.error(
        "Shipping address and phone number are required to save the order",
      );
      return;
    }

    setTempOrderUpdates((prev) => ({
      ...prev,
      ...updatedOrder,
    }));
  };

  // Add new function to handle saving all changes to the server
  const handleSaveOrder = async () => {
    if (!token || !order) return;

    try {
      // Calculate the shipping fee based on the current or updated shipping method
      const shippingFee = calculateTotal(order, tempOrderUpdates);

      // Create the final order update object with the correct total_money
      const updatedTempOrder = {
        ...order, // Start with the base order
        ...tempOrderUpdates, // Apply all temporary updates
        total_money: shippingFee, // Set the correct total_money
      };

      setTempOrderUpdates(updatedTempOrder);

      handleOpenDialog(
        "save",
        "Are you sure you want to save all changes to this order?",
      );
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order changes");
    }
  };

  // Handler for temporary updates
  const handleTempOrderUpdate = (updates: Partial<Order>) => {
    setTempOrderUpdates((prev) => {
      const newUpdates = {
        ...prev,
        ...updates,
      };

      // If shipping method is being updated, update shipping fee only
      if (updates.shipping_method) {
        const shippingFee = calculateTotal(order as Order, newUpdates);
        newUpdates.total_money = shippingFee; // Only save shipping fee
      }

      return newUpdates;
    });
  };

  // Add a function to calculate the current total
  const calculateTotal = (baseOrder: Order, tempUpdates: Partial<Order>) => {
    const currentShippingMethod =
      tempUpdates.shipping_method || baseOrder.shipping_method;
    const shippingFee =
      currentShippingMethod === "Express"
        ? SHIPPING_PRICES.express
        : SHIPPING_PRICES.standard;

    // Return only the shipping fee
    return shippingFee;
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
                <Typography color="text.secondary">
                  Subtotal (Already Paid):
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ textDecoration: "line-through", opacity: 0.7 }}
                >
                  {formatCurrency(
                    orderDetails.reduce(
                      (sum, detail) => sum + detail.total_money,
                      0,
                    ),
                  )}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Shipping Fee:</Typography>
                <Typography>
                  {formatCurrency(calculateTotal(order, tempOrderUpdates))}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total to Pay:</Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(calculateTotal(order, tempOrderUpdates))}
                </Typography>
              </Box>
            </Box>
          </OrderSection>

          {/* Shipping Information Section */}
          <OrderSection>
            {order && (
              <ShippingInformation
                order={{
                  ...order,
                  ...tempOrderUpdates, // Merge temp updates with current order
                }}
                onTempUpdate={handleTempOrderUpdate}
                onSave={handleUpdateShipping}
              />
            )}
          </OrderSection>

          {/* Add Note Section before the Action Buttons */}
          <OrderSection>
            <OrderHeader>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                <EditIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Order Notes
              </Typography>
            </OrderHeader>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes for your order"
              value={tempOrderUpdates.note || order.note || ""}
              onChange={(e) => handleTempOrderUpdate({ note: e.target.value })}
              placeholder="Add any special instructions or notes for your order here..."
              sx={{ mt: 2 }}
              disabled={order.status !== OrderStatus.PENDING}
            />
          </OrderSection>

          {/* Update the temporary changes summary to include notes */}
          {Object.keys(tempOrderUpdates).length > 0 && (
            <OrderSection>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pending Changes
              </Typography>
              {tempOrderUpdates.shipping_method && (
                <Typography>
                  Shipping Method:{" "}
                  {tempOrderUpdates.shipping_method === "Standard"
                    ? "Standard"
                    : "Express"}{" "}
                  Delivery
                </Typography>
              )}
              {tempOrderUpdates.phone_number && (
                <Typography>
                  Phone Number: {tempOrderUpdates.phone_number}
                </Typography>
              )}
              {tempOrderUpdates.note && (
                <Typography>Note: {tempOrderUpdates.note}</Typography>
              )}
              {/* Add other temporary changes here */}
            </OrderSection>
          )}

          {/* Payment Section */}
          <OrderSection>
            <OrderHeader>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                <PaymentIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Payment Information
              </Typography>
            </OrderHeader>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                id="payment-method"
                value={tempOrderUpdates.payment_method || order.payment_method}
                label="Payment Method"
                onChange={(e) =>
                  handleTempOrderUpdate({ payment_method: e.target.value })
                }
                disabled={order.status !== OrderStatus.PENDING}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Payment">Online Payment</MenuItem>
              </Select>
            </FormControl>

            <Typography
              sx={{ mt: 2, color: "text.secondary", fontSize: "0.875rem" }}
            >
              {tempOrderUpdates.payment_method === "Payment" ||
              (order.payment_method === "Payment" &&
                !tempOrderUpdates.payment_method)
                ? "You will be redirected to payment gateway after confirming"
                : "You will pay in cash upon delivery"}
            </Typography>
          </OrderSection>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
            {Object.keys(tempOrderUpdates).length > 0 && (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSaveOrder}
              >
                Save Order
              </Button>
            )}

            {order.status === OrderStatus.PENDING &&
              Object.keys(tempOrderUpdates).length === 0 && (
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
                    "Are you sure you want to mark this order as delivered?",
                  )
                }
              >
                MARK AS DELIVERED
              </Button>
            )}
          </Box>
        </>
      )}

      {/* Feedback Section */}
      {order && order.status !== OrderStatus.PENDING && (
        <OrderSection sx={{ mt: 3 }}>
          <Feedback orderId={orderId || ""} />
        </OrderSection>
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

      {/* Add a draft changes indicator */}
      {Object.keys(tempOrderUpdates).length > 0 && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            p: 2,
            backgroundColor: theme.palette.grey[200],
            zIndex: 1000,
            border: "1px solid",
            borderColor: theme.palette.grey[300],
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="body2" color="black">
            You have unsaved changes
          </Typography>
        </Paper>
      )}

      <ToastContainer />
    </Container>
  );
};

export default UserOrderDetail;
