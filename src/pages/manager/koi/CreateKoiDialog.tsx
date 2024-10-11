import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { StaffRegisterDTO } from "~/types/users.type";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

interface CreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
  newStaff: StaffRegisterDTO | null;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateStaff: () => void;
}

const CreateStaffDialog: React.FC<CreateStaffDialogProps> = ({
  open,
  onClose,
  newStaff,
  onInputChange,
  onCreateStaff,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Create New Staff</DialogTitle>
    <DialogContent>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            name="first_name"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStaff?.first_name ?? ""}
            onChange={onInputChange}
          />
          <TextField
            name="last_name"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStaff?.last_name ?? ""}
            onChange={onInputChange}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newStaff?.email ?? ""}
            onChange={onInputChange}
          />
          <TextField
            name="phone_number"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={newStaff?.phone_number ?? ""}
            onChange={onInputChange}
          />
        </Box>
        <TextField
          name="address"
          label="Address"
          type="text"
          fullWidth
          variant="outlined"
          value={newStaff?.address ?? ""}
          onChange={onInputChange}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newStaff?.password ?? ""}
            onChange={onInputChange}
          />
          <TextField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newStaff?.date_of_birth ?? ""}
            onChange={onInputChange}
          />
        </Box>
        <TextField
          name="avatar_url"
          label="Avatar URL"
          type="text"
          fullWidth
          variant="outlined"
          value={newStaff?.avatar_url ?? ""}
          onChange={onInputChange}
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onCreateStaff} variant="contained" color="primary">
        Create
      </Button>
    </DialogActions>
    <ToastContainer />
  </Dialog>
);

export default CreateStaffDialog;
