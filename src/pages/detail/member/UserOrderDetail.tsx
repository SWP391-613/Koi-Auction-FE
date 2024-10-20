import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import LoadingComponent from "~/components/shared/LoadingComponent";
import {
  fetchOrderDetails,
  updateOrder,
  createOrderPayment,
  getOrderById,
} from "~/utils/apiUtils";
import { Order, OrderDetail } from "~/types/orders.type";
import { toast, ToastContainer } from "react-toastify";
import { getCookie } from "~/utils/cookieUtils";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { PaymentDTO } from "./UserOrder";
import { useUserData } from "~/hooks/useUserData";
import { useMediaQuery } from "@mui/material";
import Feedback from "./Feedback";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export type OrderDetailWithKoi = OrderDetail & {
  koi: {
    name: string;
    image_url: string;
    owner_id: number;
  };
};

const UserOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [orderDetails, setOrderDetails] = useState<OrderDetailWithKoi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const { user, loading: userLoading, error: userError } = useUserData();
  const [order, setOrder] = useState<Order | null>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderById(parseInt(orderId), getCookie("access_token") || "")
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const koiItems = orderDetails.map((detail) => ({
    id: detail.koi.owner_id,
    name: detail.koi.name,
    thumbnail: detail.koi.image_url,
  }));

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

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <LoadingComponent />
          </Box>
        )}

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
                    <Typography variant="h6" gutterBottom>
                      {orderDetails[0].koi.name}
                    </Typography>
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
                        image={orderDetails[0].koi.image_url}
                        alt={orderDetails[0].koi.name}
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
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEditOrder}
                    >
                      Edit Order
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PaymentIcon />}
                    onClick={handlePayment}
                  >
                    Process Payment
                  </Button>
                </Box>
                {/* Feedback Section */}
                {order && order.status !== "PENDING" && (
                  <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Feedback orderId={order.id.toString()} />
                  </Paper>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      <ToastContainer />
    </Container>
  );
};

export default UserOrderDetail;
