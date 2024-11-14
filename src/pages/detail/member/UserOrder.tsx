import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import SearchBar from "~/components/shared/SearchBar";
import { useUserData } from "~/hooks/useUserData";
import { OrderResponse, OrderStatus } from "~/types/orders.type";
import { getOrderStatusColor } from "~/utils/colorUtils";
import { getCookie } from "~/utils/cookieUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import {
  canAcceptShip,
  canConfirmOrder,
  canLeaveFeedback,
} from "~/utils/orderUtils";
import { getUserOrderByStatus } from "../../../utils/apiUtils";
import { koiBreeders } from "~/utils/data/koibreeders";
import OrderSearchComponent from "~/components/search/OrderSearchComponent";
import { getUserCookieToken } from "~/utils/auth.utils";
import { BreedersResponse } from "~/types/paginated.types";
import axios from "axios";

const UserOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, loading: userLoading, error: userError } = useUserData();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    OrderStatus.ALL,
  );
  const [koiBreeders, setKoiBreeders] = useState<BreedersResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getUserOrderByStatus(
            user.id,
            selectedStatus,
            page - 1,
            itemsPerPage,
            getUserCookieToken() || "",
          );
          setOrders(response.item);
          setTotalPages(response.total_page);
        } catch (err) {
          setError("Error fetching orders");
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchAllBreeders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/breeders`,
          {
            params: {
              page: 0,
              limit: 20,
            },
          },
        );
        setKoiBreeders(response.data || []);
      } catch (error) {
        console.error("Error fetching breeders:", error);
      }
    };

    if (user) {
      fetchOrders();
      fetchAllBreeders();
    }
  }, [user, page, selectedStatus]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`order-detail/${orderId}`);
  };

  if (userLoading || loading) {
    return <LoadingComponent />;
  }

  if (userError || error) {
    return (
      <Container>
        <Alert severity="error">{userError || error}</Alert>
      </Container>
    );
  }

  if (!user) return <Alert severity="info">No user data found</Alert>;

  return (
    <div className="">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, mr: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Order Status"
              onChange={(e) =>
                handleStatusChange(e.target.value as OrderStatus)
              }
            >
              {Object.values(OrderStatus).map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  sx={{
                    color: getOrderStatusColor(status),
                  }}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {orders.length === 0 ? (
        <div className="flex justify-center">
          <Typography variant="h6">Empty {selectedStatus} order</Typography>
        </div>
      ) : (
        <>
          {/* <OrderSearchComponent onSearchStateChange={handleSearchStateChange} /> */}
          {orders.map((order) => (
            <Card
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                margin: 3,
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
                  {koiBreeders.item.find(
                    (breeder) =>
                      breeder.id === order.order_details[0].koi.owner.id,
                  ) && (
                    <div className="">
                      <Link
                        to={`/breeder/${order.order_details[0].koi.owner.id}/info`}
                        onClick={(event) => event.stopPropagation()}
                        className="inline"
                      >
                        <img
                          src={
                            koiBreeders.item.find(
                              (breeder) =>
                                breeder.id ===
                                order.order_details[0].koi.owner.id,
                            )?.avatar_url
                          }
                          alt="Breeder Avatar"
                          className="w-[40px] m-0 p-0"
                          onClick={(event) => event.stopPropagation()}
                        />
                      </Link>
                      <Link
                        to={`/breeder/${order.order_details[0].koi.owner.id}/info`}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-block"
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mt: 1 }}
                        >
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

                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                    >
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
                    label="Already paid Koi price"
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
                  Total Shipping Fee: &nbsp;
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

                  <Typography
                    variant="body2"
                    fontWeight="normal"
                    color="#808080"
                  >
                    Only click Received when you have <br />
                    received the product without any problem.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserOrder;
