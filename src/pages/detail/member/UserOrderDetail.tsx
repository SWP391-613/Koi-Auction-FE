import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingComponent from "~/components/shared/LoadingComponent";
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
          <Typography variant="h5" fontWeight="bold">
            Order Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order #{orderId}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Total Amount: ${totalOrderAmount.toFixed(2)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Estimated Delivery: 3-5 business days
            </Typography>
          </Box>
        </Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <LoadingComponent />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
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
                          ${detail.price.toFixed(2)}
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
                          ${detail.total_money.toFixed(2)}
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
