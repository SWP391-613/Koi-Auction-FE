import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { fetchKoi, updateKoi } from "~/apis/koi.apis";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { SNACKBAR_VALIDATION_MESSAGE } from "~/constants/validation.message";
import { UpdateKoiDTO } from "~/types/kois.type"; // Adjust the import path as needed
import { getCookie } from "~/utils/cookieUtils"; // Adjust the import path as needed
import {
  categoryMap,
  extractErrorMessage,
  getCategoryName,
} from "~/utils/dataConverter";

interface EditKoiDialogProps {
  open: boolean;
  onClose: () => void;
  koiId: number;
}

const inputProps = {
  readOnly: true, // Set the field as read-only
};

const BreederEditKoiDialog: React.FC<EditKoiDialogProps> = ({
  open,
  onClose,
  koiId,
}) => {
  const [koi, setKoi] = useState<UpdateKoiDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
      const data = await fetchKoi(koiId); // Use the utility function
      setKoi(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, "Failed to fetch koi data");
      toast.error(errorMessage); // Notify user of the error
      setError(errorMessage); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    const { name, value } = event.target;
    setKoi((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdateKoi = async () => {
    if (!koi) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      await updateKoi(koiId, koi); // Use the utility function
      setSnackbarMessage(SNACKBAR_VALIDATION_MESSAGE.KOI_UPDATE_SUCCESS);
      setSnackbarOpen(true);
      onClose();
      fetchKoiData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
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
              height: 100,
              width: 100,
            }}
          >
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
              <FormControl fullWidth variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  label="Gender"
                  value={koi?.sex ?? ""}
                  onChange={handleInputChange}
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="UNKNOWN">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="length"
                label="Length (cm)"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.length ?? ""}
                onChange={handleInputChange}
              />
              <TextField
                name="age"
                label="Year born"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.year_born ?? ""}
                onChange={handleInputChange}
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
                label="Base Price (VND)"
                type="number"
                fullWidth
                variant="outlined"
                value={koi?.base_price ?? ""}
                inputProps={inputProps}
              />
              <TextField
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={koi?.description ?? ""}
                onChange={handleInputChange}
              />
            </Box>
            <TextField
              name="is_display"
              label="Is Display (Yes/No)"
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.is_display == 0 ? "No" : "Yes"}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="none">
              <Select
                name="category_id"
                value={koi?.category_id ?? ""}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {Object.entries(categoryMap).map(([id, name]) => (
                  <MenuItem key={id} value={Number(id)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <ToastContainer />
    </>
  );
};

export default BreederEditKoiDialog;
