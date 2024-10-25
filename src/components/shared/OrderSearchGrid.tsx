import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography
} from "@mui/material";
import React from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { OrderResponse } from "~/types/orders.type";
import { getOrderStatusColor } from "~/utils/colorUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { koiBreeders } from "~/utils/data/koibreeders";
import {
  canAcceptShip,
  canConfirmOrder,
  canLeaveFeedback,
} from "~/utils/orderUtils";
import { EditIcon } from "../icons/EditIcon";
interface OrderSearchGridProps {
  orders: OrderResponse[];
}

const OrderSearchGrid: React.FC<OrderSearchGridProps> = ({ orders }) => {

  const navigate = useNavigate();

  const handleOrderClick = (orderId: number) => {
    navigate(`order-detail/${orderId}`);
  };

  return (
    <>
      {orders.map((order) => (
        <Card
          key={order.id}
          onClick={() => handleOrderClick(order.id)}
          sx={{
            cursor: "pointer",
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
                height: "auto",
                width: "20%",
                backgroundColor: "#1365b4",
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
              {koiBreeders.find(
                (breeder) => breeder.id === order.order_details[0].koi.owner.id,
              ) && (
                <div className="">
                  <Link
                    to={`/breeder/${order.order_details[0].koi.owner.id}/info`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline" // Make sure the link doesn't take full width
                  >
                    <img
                      src={
                        koiBreeders.find(
                          (breeder) =>
                            breeder.id === order.order_details[0].koi.owner.id,
                        )?.avatar_url
                      }
                      alt="Breeder Avatar"
                      className="w-[20%] m-0 p-0" // Ensure no extra margin or padding
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Link>
                  <Link
                    to={`/breeder/${order.order_details[0].koi.owner.id}/info`} // Same link for the button
                    onClick={(event) => event.stopPropagation()}
                    className="inline-block"
                  >
                    <Button variant="outlined" color="#808080" sx={{ mt: 1 }}>
                      View Shop
                    </Button>
                  </Link>
                </div>
              )}
              <Chip
                label={order.status}
                color={getOrderStatusColor(order.status)}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            <div className="flex justify-between">
              <div>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography variant="h3" fontWeight="medium">
                    {order.order_details[0].koi.name}
                  </Typography>
                </Box>

                {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2">
                        Shipping Method: {order.shipping_method}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2">
                        Payment Method: {order.payment_method}
                      </Typography>
                    </Box> */}

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Shipping Address: {order.shipping_address}
                  </Typography>
                </Box>
              </div>
            </div>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "start",
                mb: 2,
              }}
            >
              <Typography variant="body2">Quantity: x1</Typography>
              <Chip
                label="Refund free in 15days"
                color="primary"
                variant="outlined"
              />
            </Box>

            {canConfirmOrder(order) && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  component={RouterLink}
                  to={`/order-detail/${order.id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  Confirm Order
                </Button>
              </Box>
            )}

            {canAcceptShip(order) && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  component={RouterLink}
                  to={`/order-detail/${order.id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<LocalShippingIcon />}
                >
                  SHIPPED!
                </Button>
              </Box>
            )}

            {canLeaveFeedback(order) && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  component={RouterLink}
                  to={`/order-detail/${order.id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<FeedbackIcon />}
                >
                  Leave Feedback
                </Button>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                mb: 1,
              }}
            >
              Total Money: &nbsp;
              <Typography variant="h4" fontWeight="bold" color="#1365b4">
                {formatCurrency(order.total_money)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <Typography color="#808080" variant="body2">
                Order created at:{" "}
                {new Date(order.order_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>

              <Typography variant="body2" fontWeight="normal" color="#808080">
                Only click Received when you have <br />
                received the product without any problem.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default OrderSearchGrid;
