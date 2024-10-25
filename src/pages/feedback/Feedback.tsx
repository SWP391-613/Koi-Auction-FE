import React, { useState, useEffect } from "react";
import { Typography, Box, Rating, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { Order, OrderDetail } from "~/types/orders.type";
import { fetchOrderById, submitFeedback } from "../../utils/apiUtils";
import { getCookie } from "../../utils/cookieUtils";
import { formatCurrency } from "../../utils/currencyUtils";
import { useAuth } from "~/contexts/AuthContext";

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

interface FeedbackProps {
  orderId: string;
}

const Feedback: React.FC<FeedbackProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
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
    <Box>
      <Typography variant="h5" gutterBottom>
        Leave Feedback
      </Typography>
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
    </Box>
  );
};

export default Feedback;
