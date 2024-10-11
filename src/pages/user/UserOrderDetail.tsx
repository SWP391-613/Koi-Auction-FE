import React, { useEffect, useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Order } from "./UserOrder";
import { fetchOrderDetails } from "~/utils/apiUtils";

interface UserOrderDetailProps {
  order: Order;
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
  order,
  onClose,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  useEffect(() => {
    fetchOrderDetails(order.id).then(setOrderDetails);
  }, [order.id]);
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
          <h2 className="text-xl font-bold">Order #{order.id}</h2>
        </div>
        <div className="flex flex-col gap-4"></div>
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
