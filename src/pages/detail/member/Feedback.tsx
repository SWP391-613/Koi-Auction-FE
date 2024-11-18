import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import { Order, OrderStatus } from "~/types/orders.type";

import { getCookie } from "../../../utils/cookieUtils";
import { useAuth } from "~/contexts/AuthContext";
import { getUserCookieToken } from "~/utils/auth.utils";
import { fetchOrderById } from "~/apis/order.apis";
import { getFeedbackByOrderId, submitFeedback } from "~/apis/feedback.apis";

interface FeedbackProps {
  orderId: string;
}

export interface FeedbackRequest {
  content: string;
  rating: number;
  order_id: number;
  user_id: number;
}

const Feedback: React.FC<FeedbackProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [existingFeedback, setExistingFeedback] =
    useState<FeedbackRequest | null>(null);
  const user = useAuth();

  useEffect(() => {
    const getOrderAndFeedback = async () => {
      try {
        if (orderId) {
          const fetchedOrder = await fetchOrderById(
            Number(orderId),
            getUserCookieToken() || "",
          );
          setOrder(fetchedOrder);

          if (fetchedOrder.status === OrderStatus.DELIVERED) {
            const feedbackResponse = await getFeedbackByOrderId(
              Number(orderId),
              getUserCookieToken() || "",
            );
            if (feedbackResponse) {
              setExistingFeedback(feedbackResponse);
              setRating(feedbackResponse.rating);
              setComment(feedbackResponse.content);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order and feedback:", error);
        toast.error("Failed to fetch order details or feedback");
      }
    };

    getOrderAndFeedback();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }
    try {
      const feedbackRequest: FeedbackRequest = {
        content: comment,
        rating: rating,
        order_id: Number(orderId),
        user_id: user?.user?.id || 0,
      };
      await submitFeedback(feedbackRequest, getUserCookieToken() || "");
      toast.success("Feedback submitted successfully");
      setExistingFeedback(feedbackRequest as FeedbackRequest);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  if (!order) {
    return <Typography>Loading...</Typography>;
  }

  if (order.status !== OrderStatus.DELIVERED) {
    return (
      <Alert severity="info">
        Feedback can only be submitted for delivered orders.
      </Alert>
    );
  }

  if (existingFeedback) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Your Feedback
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" value={existingFeedback.rating} readOnly />
        </Box>
        <Typography variant="body1" gutterBottom>
          {existingFeedback.content}
        </Typography>
      </Box>
    );
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
