import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import { getUserCookieToken } from "~/utils/auth.utils";

// Types
type RecipientType = "all" | "premium" | "free";

interface NotificationForm {
  title: string;
  message: string;
  recipientType: RecipientType;
}

interface ApiError {
  message: string;
  status?: number;
}

// Constants
const COOLDOWN_DURATION = 60; // cooldown duration in seconds
const initialFormState: NotificationForm = {
  title: "",
  message: "",
  recipientType: "all",
};

const SendNotifications: React.FC = () => {
  // State
  const [notification, setNotification] =
    useState<NotificationForm>(initialFormState);
  const [isLoading, setIsLoading] = useState({
    form: false,
    upcomingNotification: false,
    closingNotification: false,
  });
  const [errors, setErrors] = useState<Partial<NotificationForm>>({});
  const [cooldown, setCooldown] = useState(0);

  // Effect for cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cooldown]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<NotificationForm> = {};

    if (!notification.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!notification.message.trim()) {
      newErrors.message = "Message is required";
    }
    if (notification.message.length > 500) {
      newErrors.message = "Message must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof NotificationForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<RecipientType>) => {
    setNotification((prev) => ({
      ...prev,
      recipientType: event.target.value as RecipientType,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading((prev) => ({ ...prev, form: true }));
    try {
      await axios.post(
        "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/notifications",
        notification,
        {
          headers: {
            Authorization: `Bearer ${getUserCookieToken()}`,
          },
        },
      );
      toast.success("Notification sent successfully");
      setNotification(initialFormState);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to send notification";
      toast.error(errorMessage);
    } finally {
      setIsLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleUpcomingNotification = async () => {
    if (cooldown > 0) {
      toast.warning(`Please wait ${cooldown} seconds before sending again`);
      return;
    }

    setIsLoading((prev) => ({ ...prev, upcomingNotification: true }));
    try {
      await axios.get(
        "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/auctions/notify/upcoming",
        {
          headers: {
            Authorization: `Bearer ${getUserCookieToken()}`,
          },
        },
      );
      toast.success("Upcoming auction notifications sent successfully");
      setCooldown(COOLDOWN_DURATION); // Start cooldown
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Failed to send upcoming auction notifications";
      toast.error(errorMessage);
    } finally {
      setIsLoading((prev) => ({ ...prev, upcomingNotification: false }));
    }
  };

  const handleClosingNotification = async () => {};

  // Get button text based on cooldown and loading state
  const getUpcomingButtonText = () => {
    if (isLoading.upcomingNotification) {
      return "Sending...";
    }
    if (cooldown > 0) {
      return `Wait ${cooldown}s`;
    }
    return "Send Upcoming Auction Notifications";
  };

  const getClosingButtonText = () => {
    if (isLoading.closingNotification) {
      return "Sending...";
    }
    if (cooldown > 0) {
      return `Wait ${cooldown}s`;
    }
    return "Send Closing Auction Notifications";
  };

  return (
    <Box className="m-5 mx-auto max-w-2xl">
      <Typography
        variant="h4"
        component="h1"
        className="mb-6 text-center font-bold"
      >
        Send Notifications
      </Typography>

      <Paper elevation={3} className="mt-6 p-6 mb-5 flex flex-col gap-3">
        <Typography variant="h6" className="mb-4">
          Quick Actions
        </Typography>
        <Button
          variant="contained"
          color="warning"
          fullWidth
          onClick={handleUpcomingNotification}
          disabled={isLoading.upcomingNotification || cooldown > 0}
          startIcon={
            isLoading.upcomingNotification && (
              <CircularProgress size={20} color="inherit" />
            )
          }
          sx={{
            "&.Mui-disabled": {
              backgroundColor:
                cooldown > 0 ? "rgba(245, 124, 0, 0.5)" : undefined,
              color: cooldown > 0 ? "white" : undefined,
            },
          }}
        >
          {getUpcomingButtonText()}
        </Button>
        <Button
          variant="contained"
          color="warning"
          fullWidth
          onClick={handleClosingNotification}
          disabled={isLoading.closingNotification || cooldown > 0}
          startIcon={
            isLoading.closingNotification && (
              <CircularProgress size={20} color="inherit" />
            )
          }
          sx={{
            "&.Mui-disabled": {
              backgroundColor:
                cooldown > 0 ? "rgba(245, 124, 0, 0.5)" : undefined,
              color: cooldown > 0 ? "white" : undefined,
            },
          }}
        >
          {getClosingButtonText()}
        </Button>
      </Paper>

      <Paper elevation={3} className="p-6 mb-5">
        <Typography variant="h6" className="mb-4">
          Send Email
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            margin="normal"
            name="title"
            label="Notification Title"
            value={notification.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isLoading.form}
            sx={{ bgcolor: "background.paper" }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="message"
            label="Notification Message"
            multiline
            rows={10}
            value={notification.message}
            onChange={handleInputChange}
            error={!!errors.message}
            helperText={errors.message}
            disabled={isLoading.form}
            sx={{ bgcolor: "background.paper" }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="recipient-type-label">Recipient Type</InputLabel>
            <Select
              labelId="recipient-type-label"
              value={notification.recipientType}
              onChange={handleSelectChange}
              disabled={isLoading.form}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="premium">Premium Users</MenuItem>
              <MenuItem value="free">Free Users</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading.form}
            startIcon={
              isLoading.form && <CircularProgress size={20} color="inherit" />
            }
          >
            {isLoading.form ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </Paper>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default SendNotifications;
