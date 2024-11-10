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

// Create a styled Button component
const GrayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  borderColor: theme.palette.grey[300],
  "&:hover": {
    borderColor: theme.palette.grey[500],
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
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4">Order Details</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
        </Box>

        {loading && <LoadingComponent />}

        {error && (
          <Typography color="error" mb={4}>
            {error}
          </Typography>
        )}

        {order && orderDetails.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Order #{orderId}
            </Typography>

            <Grid container spacing={4}>
              {/* Koi Image and Details */}
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {orderDetails[0].product_id.name}
                      </Typography>
                      {koiBreeders.find(
                        (breeder) =>
                          breeder.id === orderDetails[0].product_id.owner_id,
                      ) && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Link
                            to={`/breeder/${orderDetails[0].product_id.owner_id}/info`}
                            onClick={(event) => event.stopPropagation()}
                            style={{
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={
                                koiBreeders.find(
                                  (breeder) =>
                                    breeder.id ===
                                    orderDetails[0].product_id.owner_id,
                                )?.avatar_url
                              }
                              alt="Breeder Avatar"
                              style={{
                                width: "60px",
                                height: "60px",
                                marginRight: "10px",
                              }}
                            />
                            <GrayButton variant="outlined" size="small">
                              View Shop
                            </GrayButton>
                          </Link>
                        </Box>
                      )}
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "rgb(79 146 209)",
                        p: 1,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={orderDetails[0].product_id.thumbnail}
                        alt={orderDetails[0].product_id.name}
                        sx={{ objectFit: "contain", borderRadius: 1 }}
                      />
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>Order Date:</strong>{" "}
                      {formatDate(order.order_date)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Total Amount:</strong> $
                      {totalOrderAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Est. Ship Date:</strong>{" "}
                      {formatDate(order.shipping_date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Details */}
              <Grid item xs={12} md={8}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="first_name"
                          label="First Name"
                          value={editedOrder?.first_name || order.first_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="last_name"
                          label="Last Name"
                          value={editedOrder?.last_name || order.last_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="payment-method-label">
                            Payment Method
                          </InputLabel>
                          <Select
                            labelId="payment-method-label"
                            id="payment-method"
                            name="payment_method"
                            value={
                              editedOrder?.payment_method ||
                              order.payment_method
                            }
                            label="Payment Method"
                            onChange={(e) =>
                              handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                              )
                            }
                            disabled={!isEditing}
                          >
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Payment">Payment</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="phone_number"
                          label="Phone Number"
                          value={
                            editedOrder?.phone_number || order.phone_number
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="shipping_address"
                          label="Shipping Address"
                          value={
                            editedOrder?.shipping_address ||
                            order.shipping_address
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="note"
                          label="Note"
                          multiline
                          rows={3}
                          value={editedOrder?.note || order.note}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box mt={4} display="flex" justifyContent="space-between">
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
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    order.status === OrderStatus.PENDING && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleEditOrder}
                      >
                        Edit Order
                      </Button>
                    )
                  )}
                  {order.status === OrderStatus.PENDING && (
                    <Button
                      variant="contained"
                      color="secondary"
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
                        color="secondary"
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
                </Box>
                {/* Feedback Section */}
                {order && order.status !== "PENDING" && (
                  <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Feedback orderId={orderId || ""} />
                  </Paper>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

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
