import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Order, OrderStatus } from "~/types/orders.type";
import { formatCurrency } from "~/utils/currencyUtils";

interface OrderSearchTableProps {
  orders: Order[];
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

const OrderSearchTable: React.FC<OrderSearchTableProps> = ({
  orders,
  onStatusUpdate,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="order search table">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Total Money</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Shipping Method</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell>{`${order.first_name} ${order.last_name}`}</TableCell>
              <TableCell>{formatCurrency(order.total_money)}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.payment_method}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.shipping_method}</TableCell>
              <TableCell>
                {order.status === OrderStatus.PROCESSING && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        onStatusUpdate(order.id, OrderStatus.SHIPPED)
                      }
                      sx={{ mr: 1 }}
                    >
                      Ship
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() =>
                        onStatusUpdate(order.id, OrderStatus.CANCELLED)
                      }
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {order.status === OrderStatus.SHIPPED && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        onStatusUpdate(order.id, OrderStatus.DELIVERED)
                      }
                      sx={{ mr: 1 }}
                    >
                      Delivered
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() =>
                        onStatusUpdate(order.id, OrderStatus.CANCELLED)
                      }
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderSearchTable;
