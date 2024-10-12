import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Staff } from "~/types/users.type"; // Adjust the import path as needed
import { getCookie } from "~/utils/cookieUtils"; // Adjust the import path as needed
import { toast } from "react-toastify";
import { getStaffData, updateStaff } from "~/utils/apiUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

interface EditStaffDialogProps {
  open: boolean;
  onClose: () => void;
  staffId: number;
}

const inputProps = {
  readOnly: true, // Set the field as read-only
};

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({
  open,
  onClose,
  staffId,
}) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchStaffData();
    }
  }, [open, staffId]);

  const getAccessToken = () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return null;
    }
    return accessToken;
  };

  const fetchStaffData = async () => {
    setLoading(true);
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const staffData = await getStaffData(staffId, accessToken); // Use the utility function
      setStaff(staffData);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to fetch staff data",
      );
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStaff((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdateStaff = async () => {
    if (!staff) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      await updateStaff(staffId, staff, accessToken); // Use the utility function for the API call
      setSnackbar({ open: true, message: "Staff updated successfully" });
      onClose();
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to update staff");
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ color: "error.main" }}>{error}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Staff Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={staff?.first_name ?? ""}
                onChange={handleInputChange}
              />
              <TextField
                name="last_name"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={staff?.last_name ?? ""}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={staff?.email ?? ""}
                onChange={handleInputChange}
                inputProps={inputProps}
              />
              <TextField
                name="phone_number"
                label="Phone Number"
                type="tel"
                fullWidth
                variant="outlined"
                value={staff?.phone_number ?? ""}
                onChange={handleInputChange}
                inputProps={inputProps}
              />
            </Box>
            <TextField
              name="address"
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
              value={staff?.address ?? ""}
              onChange={handleInputChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={staff?.date_of_birth ?? ""}
                onChange={handleInputChange}
              />
              <TextField
                name="avatar_url"
                label="Avatar URL"
                type="text"
                fullWidth
                variant="outlined"
                value={staff?.avatar_url ?? ""}
                onChange={handleInputChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleUpdateStaff}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export default EditStaffDialog;
