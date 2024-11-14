import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import LoadingComponent from "~/components/shared/LoadingComponent";
import { Order } from "~/types/orders.type";

interface EditOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (editedOrder: Order) => void;
  accessToken: string;
}

export type PaymentRequest = {
  payment_amount: number;
  payment_method: string;
  payment_type: string;
  order_id: number | null;
  user_id: number;
};

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onClose,
  order,
  onSave,
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
      onSave(editedOrder);
      onClose();
      // Remove the toast from here as it will be handled in UserOrder.tsx
    } catch (err) {
      setError("Failed to update order information. Please try again.");
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
            {loading ? <LoadingComponent /> : "Save Changes"}
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
