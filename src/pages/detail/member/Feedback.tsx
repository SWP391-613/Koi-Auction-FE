import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Divider,
  CardMedia,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { Order } from "./UserOrder";
import {
  fetchOrderById,
  fetchOrderDetails,
  submitFeedback,
} from "../../../utils/apiUtils";
import { getCookie } from "../../../utils/cookieUtils";
import { formatCurrency } from "../../../utils/currencyUtils";
import { useAuth } from "~/contexts/AuthContext";

export type OrderDetail = {
  id: number;
  color: string | null;
  order_id: number;
  product_id: number;
  price: number;
  number_of_products: number;
  total_money: number;
};

export type OrderDetailWithKoi = OrderDetail & {
  koi: {
    name: string;
    image_url: string;
  };
};

export type feedbackDTO = {
  content: string;
  rating: number;
  order_id: number;
  user_id: number;
};

const Feedback: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailWithKoi[]>([]);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const user = useAuth();
  useEffect(() => {
    const getOrderAndDetails = async () => {
      try {
        if (orderId) {
          const fetchedOrder = await fetchOrderById(
            Number(orderId),
            getCookie("access_token") || "",
          );
          setOrder(fetchedOrder);
          const fetchedOrderDetails = await fetchOrderDetails(Number(orderId));
          setOrderDetails(fetchedOrderDetails);
        }
      } catch (error) {
        console.error("Error fetching order and details:", error);
        toast.error("Failed to fetch order details");
      }
    };

    getOrderAndDetails();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }
    try {
      const feedbackDTO: feedbackDTO = {
        content: comment,
        rating: rating,
        order_id: Number(orderId),
        user_id: user?.user?.id || 0,
      };
      await submitFeedback(feedbackDTO, getCookie("access_token") || "");
      toast.success("Feedback submitted successfully");
      // Redirect or update UI as needed
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  if (!order) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leave Feedback for Order #{orderId}
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Order Date:</Typography>
              <Typography>
                {new Date(order.order_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Amount:</Typography>
              <Typography>{formatCurrency(order.total_money)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Shipping Address:</Typography>
              <Typography>{order.shipping_address}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {orderDetails.length > 0 ? (
          orderDetails.map((detail) => (
            <Grid item xs={12} sm={6} md={4} key={detail.id}>
              <Card elevation={3}>
                <Box
                  sx={{
                    backgroundColor: "rgb(79 146 209)",
                    p: 1,
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={detail.koi.image_url}
                    alt={detail.koi.name}
                    sx={{ objectFit: "contain", borderRadius: 1 }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {detail.koi.name}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Price:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(detail.price)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Quantity:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {detail.number_of_products}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle2">Total:</Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      {formatCurrency(detail.total_money)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" variant="subtitle1">
              No order details available.
            </Typography>
          </Grid>
        )}
      </Grid>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Your Feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Feedback
        </Button>
      </form>
    </Container>
  );
};

export default Feedback;
