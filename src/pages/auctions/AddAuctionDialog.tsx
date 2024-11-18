import {
  Button,
  CircularProgress,
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
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createNewAuction } from "~/apis/auction.apis";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { AddNewAuctionDTO, AuctionModel } from "~/types/auctions.type";
import { Staff } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage, prepareAuctionData } from "~/utils/dataConverter";

interface StaffApiResponse {
  total_page: number;
  total_item: number;
  item: Staff[];
}

interface AddAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  newAuction: Partial<AuctionModel>;
  onInputChange: (name: string, value: unknown) => void;
}

const AddAuctionDialog: React.FC<AddAuctionDialogProps> = ({
  open,
  onClose,
  newAuction,
  onInputChange,
}) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [formData, setFormData] = useState<AddNewAuctionDTO>({
    title: "",
    start_time: "",
    end_time: "",
    status: AUCTION_STATUS.UPCOMING,
    auctioneer_id: 21,
  });

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  const [defaultStartTime] = useState(getCurrentDateTime());

  const fetchStaffList = async () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<StaffApiResponse>(
        "${API_URL_DEVELOPMENT}/staffs",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: 0,
            limit: 10,
          },
        },
      );
      setStaffList(response.data.item);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!validateForm()) {
      setSnackbarMessage("Please fix the errors in the form.");
      setSnackbarOpen(true);
      return;
    }

    const auctionData = prepareAuctionData(formData);
    console.log("Data to be submitted:", auctionData);
    try {
      await createNewAuction(auctionData);
      toast.success("Auction added successfully");
      setSnackbarMessage("Koi created successfully!");
      setSnackbarOpen(true);
      console.log("Auction added successfully");
      onClose();
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to add auction");
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) {
      newErrors.title = "Auction title is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (formData.auctioneer_id <= 0) {
      newErrors.auctioneer_id = "Auctioneer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(() => {
    if (open) {
      if (!newAuction.start_time) {
        onInputChange("start_time", defaultStartTime);
      }

      fetchStaffList();
    }
  }, [open, newAuction.start_time, defaultStartTime, onInputChange, navigate]);

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    // Update only the changed field, keeping other fields intact
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Update the specific field
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm" // or "lg" for larger widths
        fullWidth
      >
        <DialogTitle>Add New Auction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Auction Title"
            type="text"
            fullWidth
            variant="standard"
            value={formData.title || ""}
            onChange={handleTextFieldChange}
          />
          <div className="flex gap-10">
            <TextField
              margin="dense"
              name="start_time"
              label="Start Time"
              type="datetime-local"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.start_time || ""}
              error={!!errors.start_time}
              onChange={handleTextFieldChange}
              InputProps={{
                inputProps: {
                  min: defaultStartTime,
                },
              }}
            />
            <TextField
              margin="dense"
              name="end_time"
              label="End Time"
              type="datetime-local"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.end_time}
              value={formData.end_time || ""}
              onChange={handleTextFieldChange}
              InputProps={{
                inputProps: {
                  min: formData.start_time || defaultStartTime,
                },
              }}
            />
          </div>
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
            value={AUCTION_STATUS.UPCOMING}
            onChange={handleTextFieldChange}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="auctioneer-select-label">Auctioneer</InputLabel>
            <Select
              labelId="auctioneer-select-label"
              id="auctioneer-select"
              name="auctioneer_id"
              value={formData.auctioneer_id.toString() || ""}
              error={!!errors.auctioneer_id}
              onChange={handleDropdownChange}
              label="Auctioneer"
            >
              {staffList?.map((staff, index) => (
                <MenuItem key={index} value={staff.id}>
                  {`${staff.first_name} ${staff.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            variant="contained"
            color="primary"
            disabled={loading} // Disable button while submitting
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default AddAuctionDialog;
