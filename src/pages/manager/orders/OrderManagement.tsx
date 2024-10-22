import { Alert, Button, Container, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { Order, OrderStatus } from "~/types/orders.type";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import OrderSearchComponent from "~/components/search/OrderSearchComponent";

const ORDER_MANAGEMENT_HEADER = [
  "Order ID",
  "Customer",
  "Date",
  "Total",
  "Status",
  "Actions",
];

const OrderManagement = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const accessToken = getCookie("access_token");

  useEffect(() => {
    if (!accessToken) {
      navigate("/notfound");
    }
  }, [accessToken, navigate]);

  if (!accessToken) return null;

  const handleView = (id: number) => {
    navigate(`/orders/${id}`);
  };

  // const handleDelete = async (id: number) => {
  //   const confirmed = window.confirm(
  //     `Are you sure you want to delete order: ${id}?`
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await deleteOrderById(id, accessToken);
  //     toast.success("Order deleted successfully!");
  //     // Refresh the order list after deletion
  //     // You might want to implement a function to refresh the orders
  //   } catch (err: any) {
  //     const errorMessage = extractErrorMessage(err, "Error deleting order");
  //     toast.error(errorMessage);
  //     setError(errorMessage);
  //   }
  // };

  // const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
  //   try {
  //     await updateOrderStatus(id, newStatus, accessToken);
  //     toast.success("Order status updated successfully!");
  //     // Refresh the order list after status update
  //     // You might want to implement a function to refresh the orders
  //   } catch (err: any) {
  //     const errorMessage = extractErrorMessage(err, "Error updating order status");
  //     toast.error(errorMessage);
  //     setError(errorMessage);
  //   }
  // };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" gutterBottom>
            Order Management
          </Typography>
        </div>
        <OrderSearchComponent
          onSearchStateChange={(isActive) => {
            // You can use this callback to update UI based on search state
            console.log("Search is active:", isActive);
          }}
        />
        <div className="-mx-4 overflow-hidden px-4 py-4 sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <TableHeaderComponent headers={ORDER_MANAGEMENT_HEADER} />
              <tbody>{/* Map through orders here */}</tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderManagement;
