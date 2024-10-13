import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Order } from "./UserOrder";
import { updateOrder, createOrderPayment } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";

interface EditOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (editedOrder: Order) => void;
  accessToken: string;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onClose,
  order,
  onSave,
  accessToken = getCookie("access_token") || "",
}) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  React.useEffect(() => {
    setEditedOrder(order);
    setError(null);
  }, [order]);

  if (!editedOrder) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const handleSave = async () => {
    if (!editedOrder) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!editedOrder) return;

    setLoading(true);
    setError(null);

    try {
      if (editedOrder.payment_method === "Payment") {
        // Create VNPay payment for order
        const paymentResponse = await createOrderPayment(
          editedOrder.total_money,
          accessToken,
        );

        if (paymentResponse.paymentUrl) {
          // Redirect to VNPay payment page
          window.location.href = paymentResponse.paymentUrl;
          // after payment success, update the order
          // the below condition is not working, implement later
          if (paymentResponse.paymentUrl.includes("success")) {
            const updatedOrder = await updateOrder(editedOrder, accessToken);
            onSave(updatedOrder);
            onClose();
          } else {
            setError("Failed to create payment. Please try again.");
          }
        } else {
          // For Cash on Delivery, update the order directly
          const updatedOrder = await updateOrder(editedOrder, accessToken);
          onSave(updatedOrder);
          onClose();
        }
      }
    } catch (err) {
      setError("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Order #{editedOrder.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={editedOrder.first_name}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={editedOrder.last_name}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={editedOrder.phone_number}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address"
                name="shipping_address"
                value={editedOrder.shipping_address}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                name="note"
                value={editedOrder.note}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Shipping Method</FormLabel>
                <RadioGroup
                  aria-label="shipping-method"
                  name="shipping_method"
                  value={editedOrder.shipping_method}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Express"
                    control={<Radio />}
                    label="Express"
                  />
                  <FormControlLabel
                    value="Standard"
                    control={<Radio />}
                    label="Standard"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                  aria-label="payment-method"
                  name="payment_method"
                  value={editedOrder.payment_method}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Cash"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                  <FormControlLabel
                    value="Payment"
                    control={<Radio />}
                    label="Online Payment"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <MuiDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <MuiDialogTitle>
          <Typography variant="h6">Confirm Changes</Typography>
        </MuiDialogTitle>
        <MuiDialogContent>
          <Typography variant="body1" gutterBottom>
            Please review and confirm the following changes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="First Name"
                secondary={editedOrder?.first_name}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Last Name"
                secondary={editedOrder?.last_name}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Phone Number"
                secondary={editedOrder?.phone_number}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Shipping Address"
                secondary={editedOrder?.shipping_address}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Note" secondary={editedOrder?.note} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Payment Method"
                secondary={
                  editedOrder?.payment_method === "Cash"
                    ? "Cash on Delivery"
                    : "Online Payment"
                }
              />
            </ListItem>
          </List>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            color="primary"
            variant="contained"
          >
            Confirm Changes
          </Button>
        </MuiDialogActions>
      </MuiDialog>
    </>
  );
};

export default EditOrderDialog;
