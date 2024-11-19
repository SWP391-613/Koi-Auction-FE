import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { FeedbackRequest } from "~/pages/detail/member/Feedback";

export const submitFeedback = async (
  feedbackData: FeedbackRequest,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.post(
      `${DYNAMIC_API_URL}/feedbacks`,
      feedbackData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.reason || "Failed to submit feedback";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const getFeedbackByOrderId = async (orderId: number, token: string) => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/feedbacks/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {}
};
