import React, { useEffect, useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchOrderDetails } from "~/utils/apiUtils";

interface UserOrderDetailProps {
  orderId: number;
  onClose: () => void;
}

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

const UserOrderDetail: React.FC<UserOrderDetailProps> = ({
  orderId,
  onClose,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailWithKoi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLoading(true);
    fetchOrderDetails(orderId)
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
  }, [orderId]);

  const totalOrderAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.total_money,
    0,
  );

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Order Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Order #{orderId}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Total Amount: ${totalOrderAmount.toFixed(2)}
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {orderDetails.length > 0 ? (
              orderDetails.map((detail) => (
                <Grid item xs={12} sm={6} md={4} key={detail.id}>
                  <Card elevation={3}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={detail.koi.image_url}
                      alt={detail.koi.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {detail.koi.name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Price:
                        </Typography>
                        <Typography variant="body2">
                          ${detail.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Quantity:
                        </Typography>
                        <Typography variant="body2">
                          {detail.number_of_products}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">Total:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          ${detail.total_money.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center">
                  No order details available.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default UserOrderDetail;
