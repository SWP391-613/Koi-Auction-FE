import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Order } from "~/types/orders.type";

interface OrderSearchGridProps {
  orders: Order[];
}

const OrderSearchGrid: React.FC<OrderSearchGridProps> = ({ orders }) => {
  return (
    <Grid container spacing={3}>
      {orders.map((order) => (
        <Grid item xs={12} sm={6} md={4} key={order.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order #{order.id}</Typography>
              <Typography>Status: {order.status}</Typography>
              <Typography>
                Customer: {order.first_name} {order.last_name}
              </Typography>
              <Typography>Total: ${order.total_money}</Typography>
              <Typography>
                Date: {new Date(order.order_date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderSearchGrid;
