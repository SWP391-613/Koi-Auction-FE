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
import "react-toastify/dist/ReactToastify.css";
import { fetchKoi, updateKoi } from "~/apis/koi.apis";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { KOI_CREATE_FORM_LABEL } from "~/constants/label";
import { koiNameRegex } from "~/constants/regex";
import {
  KOI_CREATE_VALIDATION_MESSAGE,
  SNACKBAR_VALIDATION_MESSAGE,
} from "~/constants/validation.message";
import { KoiDetailModel } from "~/types/kois.type"; // Adjust the import path as needed
import { getCookie } from "~/utils/cookieUtils"; // Adjust the import path as needed
import { categoryMap, extractErrorMessage } from "~/utils/dataConverter";

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
  const [koi, setKoi] = useState<KoiDetailModel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    const { name, value } = e.target;

    // For number fields, ensure value is not negative
    if (["length", "category_id", "year_born"].includes(name)) {
      const numValue = Number(value);
      if (numValue < 0) return; // Prevent negative values
    }

    setKoi((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    const requiredFields = [
      {
        field: "name",
        validate: () => !koiNameRegex.test(koi?.name || ""),
        errorMessage:
          KOI_CREATE_VALIDATION_MESSAGE.KOI_NAME_MUST_FOLLOWING_FORMAT,
      },
      {
        field: "sex",
        validate: () => !koi?.sex,
        errorMessage: KOI_CREATE_VALIDATION_MESSAGE.GENDER_IS_REQUIRED,
      },
      {
        field: "length",
        validate: () => !koi?.length,
        errorMessage: KOI_CREATE_VALIDATION_MESSAGE.LENGTH_IS_REQUIRED,
      },
      {
        field: "year_born",
        validate: () => !koi?.year_born,
        errorMessage: KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_IS_REQUIRED,
      },
      {
        field: "thumbnail",
        validate: () => !koi?.thumbnail,
        errorMessage: KOI_CREATE_VALIDATION_MESSAGE.THUMBNAIL_URL_IS_REQUIRED,
      },
      {
        field: "is_display",
        validate: () => !koi?.is_display,
        errorMessage: KOI_CREATE_VALIDATION_MESSAGE.IS_DISPLAY_IS_REQUIRED,
      },
    ];

    requiredFields.forEach(({ field, validate, errorMessage }) => {
      if (validate()) {
        newErrors[field] = errorMessage;
      }
    });

    // Additional specific validations
    if (koi) {
      // Length validation
      if (koi.length <= 0 || koi.length >= 125) {
        newErrors.length =
          KOI_CREATE_VALIDATION_MESSAGE.LENGTH_MUST_BE_GREATER_THAN_ZERO_AND_LESS_THAN_125;
      }

      // Year born validations
      if (koi.year_born < 0) {
        newErrors.year_born =
          KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_CANNOT_BE_NEGATIVE;
      }

      if (koi.year_born > new Date().getFullYear()) {
        newErrors.year_born =
          KOI_CREATE_VALIDATION_MESSAGE.YEAR_BORN_CANNOT_BE_IN_FUTURE;
      }

      // Category validation
      if (koi.category_id <= 0) {
        newErrors.category_id =
          KOI_CREATE_VALIDATION_MESSAGE.CATEGORY_IS_REQUIRED;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateKoi = async () => {
    if (!koi) return;

    if (!validateForm()) {
      setSnackbarMessage(
        SNACKBAR_VALIDATION_MESSAGE.PLEASE_FIX_THE_ERRORS_IN_THE_FORM,
      );
      setSnackbarOpen(true);
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      await updateKoi(koiId, koi); // Use the utility function
      setSnackbarMessage(SNACKBAR_VALIDATION_MESSAGE.KOI_UPDATE_SUCCESS);
      toast.success(SNACKBAR_VALIDATION_MESSAGE.KOI_UPDATE_SUCCESS);
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
    return <LoadingComponent />;
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
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle fontSize={20} sx={{ textAlign: "center" }}>
          Edit Koi
        </DialogTitle>
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
                error={!!errors.name}
                helperText={errors.name}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="sex"
                  label="Gender"
                  value={koi?.sex ?? ""}
                  onChange={handleInputChange}
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="UNKNOWN">Unknown</MenuItem>
                </Select>
                {errors.gender && (
                  <p style={{ color: "red" }}>{errors.gender}</p>
                )}
              </FormControl>
            </Box>
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
              {errors.category_id && (
                <p style={{ color: "red" }}>{errors.category_id}</p>
              )}
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="length"
                label={KOI_CREATE_FORM_LABEL.LENGTH}
                type="number"
                fullWidth
                variant="outlined"
                value={koi?.length ?? ""}
                inputProps={{ min: 0 }}
                onChange={handleInputChange}
                error={!!errors.length}
                helperText={errors.length}
              />
              <TextField
                name="year_born"
                label={KOI_CREATE_FORM_LABEL.YEAR_BORN}
                type="number"
                fullWidth
                variant="outlined"
                value={koi?.year_born ?? ""}
                inputProps={{
                  min: 1000, // Set the minimum year (e.g., 1900)
                  max: new Date().getFullYear(), // Set the maximum year to the current year
                }}
                onChange={handleInputChange}
                error={!!errors.year_born}
                helperText={errors.year_born}
              />
            </Box>
            <TextField
              name="thumbnail"
              label={KOI_CREATE_FORM_LABEL.THUMBNAIL_URL}
              type="text"
              fullWidth
              variant="outlined"
              value={koi?.thumbnail ?? ""}
              onChange={handleInputChange}
              error={!!errors.thumbnail}
              helperText={errors.thumbnail}
            />
            <TextField
              fullWidth
              name="description"
              label={KOI_CREATE_FORM_LABEL.DESCRIPTION}
              type="text"
              variant="outlined"
              multiline
              rows={3}
              value={koi?.description ?? ""}
              onChange={handleInputChange}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="is_display-label">Is Display</InputLabel>
              <Select
                labelId="is_display-label"
                name="is_display"
                type="number"
                label="Is display (1/0)"
                value={koi?.is_display ?? ""}
                onChange={handleInputChange}
              >
                <MenuItem value="" disabled>
                  Select Is Display
                </MenuItem>
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
              {errors.is_display && (
                <p style={{ color: "red" }}>{errors.is_display}</p>
              )}
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
