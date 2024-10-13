import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Order } from "./UserOrder";

interface EditOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (editedOrder: Order) => void;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onClose,
  order,
  onSave,
}) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(order);

  React.useEffect(() => {
    setEditedOrder(order);
  }, [order]);

  if (!editedOrder) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const handleSave = () => {
    onSave(editedOrder);
  };

  return (
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
              label="Shipping Method"
              name="shipping_method"
              value={editedOrder.shipping_method}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
