import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { OrderResponse, OrderStatus } from "~/types/orders.type";
import { BreedersResponse } from "~/types/paginated.types";
import { getOrderStatusColor } from "~/utils/colorUtils";
import { formatCurrency } from "~/utils/currencyUtils";

interface OrderSearchGridProps {
  orders: OrderResponse[];
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

const OrderSearchGrid: React.FC<OrderSearchGridProps> = ({
  orders,
  onStatusUpdate,
}) => {
  const [koiBreeders, setKoiBreeders] = useState<BreedersResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });

  useEffect(() => {
    const fetchAllBreeders = async () => {
      try {
        const response = await axios.get(`${API_URL_DEVELOPMENT}/breeders`, {
          params: {
            page: 0,
            limit: 20,
          },
        });
        setKoiBreeders(response.data || []);
      } catch (error) {
        console.error("Error fetching breeders:", error);
      }
    };

    fetchAllBreeders();
  }, []);

  const LabeledInfo = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <Typography variant="body2">
      <strong>{label}:</strong> {value}
    </Typography>
  );

  return (
    <>
      {orders.map((order) => (
        <Card
          key={order.id}
          sx={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 3,
            overflow: "hidden",
          }}
        >
          {order.order_details[0].koi.thumbnail && (
            <CardMedia
              component="img"
              sx={{
                height: "500px",
                width: "20%",
                backgroundColor: "#1365b4",
                objectFit: "contain",
                objectPosition: "center",
                padding: "8px",
              }}
              image={order.order_details[0].koi.thumbnail}
              alt="Koi"
            />
          )}
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" component="div" sx={{ mr: 2 }}>
                  Order #{order.id}
                </Typography>
                <Chip
                  label={order.status}
                  color={getOrderStatusColor(order.status)}
                />
              </Box>
              {koiBreeders.item.find(
                (breeder) => breeder.id === order.order_details[0].koi.owner_id,
              ) && (
                <div className="">
                  <Link
                    to={`/breeder/${order.order_details[0].koi.owner_id}/info`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline"
                  >
                    <img
                      src={
                        koiBreeders.item.find(
                          (breeder) =>
                            breeder.id === order.order_details[0].koi.owner_id,
                        )?.avatar_url
                      }
                      alt="Breeder Avatar"
                      className="w-[40px] m-0 p-0"
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Link>
                  <Link
                    to={`/breeder/${order.order_details[0].koi.owner_id}/info`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-block"
                  >
                    <Button variant="outlined" color="primary" sx={{ mt: 1 }}>
                      View Shop
                    </Button>
                  </Link>
                </div>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, height: "100%", backgroundColor: "#f0f8ff" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Customer Info
                  </Typography>
                  <LabeledInfo
                    label="Name"
                    value={`${order.first_name} ${order.last_name}`}
                  />
                  <LabeledInfo label="Phone" value={order.phone_number} />
                  <LabeledInfo label="Email" value={order.email} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, height: "100%", backgroundColor: "#fff0f5" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Koi Details
                  </Typography>
                  <LabeledInfo
                    label="Name"
                    value={order.order_details[0].koi.name}
                  />
                  <LabeledInfo
                    label="Quantity"
                    value={order.order_details[0].numberOfProducts}
                  />
                  <Box sx={{ mt: 2 }}></Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, height: "100%", backgroundColor: "#f0fff0" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Shipping Info
                  </Typography>
                  <LabeledInfo label="Address" value={order.shipping_address} />
                  <LabeledInfo label="Method" value={order.shipping_method} />
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Order Details
              </Typography>
              <LabeledInfo
                label="Payment Method"
                value={order.payment_method}
              />
              <LabeledInfo
                label="Order Date"
                value={new Date(order.order_date).toLocaleDateString()}
              />
              <LabeledInfo
                label="Shipping Date"
                value={new Date(order.shipping_date).toLocaleDateString()}
              />
            </Box>

            <Box
              sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {order.status === OrderStatus.PROCESSING && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      onStatusUpdate(order.id, OrderStatus.SHIPPING)
                    }
                  >
                    Ship Order
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      onStatusUpdate(order.id, OrderStatus.CANCELLED)
                    }
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {order.status === OrderStatus.SHIPPING && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      onStatusUpdate(order.id, OrderStatus.DELIVERED)
                    }
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      onStatusUpdate(order.id, OrderStatus.CANCELLED)
                    }
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {order.status === OrderStatus.DELIVERED && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    onStatusUpdate(order.id, OrderStatus.COMPLETED)
                  }
                >
                  Mark as Completed
                </Button>
              )}
              <div className="flex flex-row justify-between items-end">
                <Typography variant="h6" fontWeight="bold">
                  Price:
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {formatCurrency(order.total_money)}
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default OrderSearchGrid;
