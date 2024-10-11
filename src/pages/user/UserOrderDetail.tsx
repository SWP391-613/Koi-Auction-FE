import React, { useEffect, useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Order } from "./UserOrder";
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

const UserOrderDetail: React.FC<UserOrderDetailProps> = ({
  orderId,
  onClose,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>Order Details</span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Order #{orderId}</h2>
        </div>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {orderDetails.length > 0 ? (
              orderDetails.map((detail) => (
                <div key={detail.id} className="border p-2 rounded">
                  <p>Product ID: {detail.product_id}</p>
                  <p>Color: {detail.color || "N/A"}</p>
                  <p>Price: ${detail.price}</p>
                  <p>Quantity: {detail.number_of_products}</p>
                  <p>Total: ${detail.total_money}</p>
                </div>
              ))
            ) : (
              <p>No order details available.</p>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default UserOrderDetail;
