import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { KoiDetailModel } from "~/types/kois.type"; // Adjust the import path as needed
import { fetchKoi, updateKoi } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils"; // Adjust the import path as needed
import { extractErrorMessage } from "~/utils/dataConverter";

interface EditKoiDialogProps {
  open: boolean;
  onClose: () => void;
  koiId: number;
}

const inputProps = {
  readOnly: true, // Set the field as read-only
};

const EditKoiDialog: React.FC<EditKoiDialogProps> = ({
  open,
  onClose,
  koiId,
}) => {
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchKoiData();
    }
  }, [open, koiId]);

  const getAccessToken = () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/notfound");
      return null;
    }
    return accessToken;
  };

  const fetchKoiData = async () => {
    setLoading(true);
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const data = await fetchKoi(koiId, accessToken); // Use the utility function
      setKoi(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, "Failed to fetch koi data");
      toast.error(errorMessage); // Notify user of the error
      setError(errorMessage); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setKoi((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdateKoi = async () => {
    if (!koi) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      await updateKoi(koiId, koi, accessToken); // Use the utility function
      setSnackbar({ open: true, message: "Koi updated successfully" });
      onClose();
    } catch (err) {
      const errorMessage = extractErrorMessage(err, "Failed to update koi");
      toast.error(errorMessage); // Notify user of the error
      setError(errorMessage); // Set error state
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
            log
            <LoadingComponent />
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
        <DialogTitle>Edit Koi</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.name ?? ""}
                onChange={handleInputChange}
              />
              <TextField
                name="gender"
                label="Gender"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.sex ?? ""}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="length"
                label="Length"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.length ?? ""}
                onChange={handleInputChange}
                inputProps={inputProps}
              />
              <TextField
                name="age"
                label="age"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.age ?? ""}
                onChange={handleInputChange}
                inputProps={inputProps}
              />
            </Box>
            <TextField
              name="thumbnail"
              label="thumbnail"
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.thumbnail ?? ""}
              onChange={handleInputChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="base_price"
                label="Base Price"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={koi?.base_price ?? ""}
                onChange={handleInputChange}
              />
              <TextField
                name="status_name"
                label="Status"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.status_name ?? ""}
                onChange={handleInputChange}
              />
            </Box>
            <TextField
              name="is_display"
              label="Is Display"
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.is_display ?? ""}
              onChange={handleInputChange}
            />
            <TextField
              name="owner_id"
              label="Owner Id"
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.owner_id ?? ""}
              onChange={handleInputChange}
            />
            <TextField
              name="category_id"
              label="Category Id"
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.category_id ?? ""}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdateKoi} variant="contained" color="primary">
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

export default EditKoiDialog;
