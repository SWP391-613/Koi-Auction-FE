import React, { useState, useEffect } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import AuctionKoiView from "~/pages/auctions/AuctionKoiView";
import { getCookie } from "~/utils/cookieUtils";
import { Staff } from "~/types/users.type";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import axios from "axios";
import { StaffsResponse } from "~/types/paginated.types";

interface EditAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingAuction: AuctionModel | null;
  handleEndAuction: (auctionId: number) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  auctionKois: AuctionKoi[];
  onEdit: (koiId: number) => void;
  onDelete: (koiId: number) => void;
  formatDateForInput: (date: string) => string;
}

interface ValidationErrors {
  title?: string;
  start_time: string;
  end_time: string;
}

const EditAuctionDialog: React.FC<EditAuctionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingAuction,
  handleEndAuction,
  onInputChange,
  auctionKois,
  onEdit,
  onDelete,
  formatDateForInput,
}) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    title: "",
    start_time: "",
    end_time: "",
  });

  const isUpcoming = editingAuction?.status === "UPCOMING";

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    // Pass the updated value and name directly to onInputChange
    onInputChange({
      target: {
        name: name || "",
        value: value,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // Helper function to format duration
  const formatDuration = (hours: number, minutes: number): string => {
    const formattedHours = Math.floor(hours);
    const formattedMinutes = Math.round(minutes);

    if (formattedHours === 0) {
      return `${formattedMinutes} minutes`;
    } else if (formattedMinutes === 0) {
      return `${formattedHours} hours`;
    }
    return `${formattedHours} hours and ${formattedMinutes} minutes`;
  };

  const fetchStaffList = async () => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<StaffsResponse>(
        `${DYNAMIC_API_URL}/staffs/active`,
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

  // Validate title format (capitalize first letter of each word)
  // const validateTitle = (title: string): string => {
  //   if (!isUpcoming) return "";
  //   if (!title.trim()) return "Title is required";
  //   const words = title.split(" ");
  //   const isCorrectFormat = words.every(
  //     (word) =>
  //       word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase(),
  //   );
  //   return isCorrectFormat ? "" : "Each word must start with a capital letter";
  // };

  // Validate start time is not in the past and calculate the time difference
  const validateStartTime = (startTime: string): string => {
    if (!isUpcoming) return "";
    const start = new Date(startTime);
    const now = new Date();

    if (start <= now) {
      const diffMs = now.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffMinutes = (diffHours % 1) * 60;

      const duration = formatDuration(diffHours, diffMinutes);
      return `Start time cannot be in the past (${duration} ago)`;
    }

    if (start > now) {
      const diffMs = start.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffMinutes = (diffHours % 1) * 60;

      const duration = formatDuration(diffHours, diffMinutes);
      return `Auction will start in ${duration}`;
    }

    return "";
  };

  // Validate end time is at least 2 days after start time
  const validateEndTime = (startTime: string, endTime: string): string => {
    if (!isUpcoming) return "";
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Calculate the time difference
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    const remainingMinutes = (remainingHours % 1) * 60;

    if (end <= start) {
      return "End time must be after start time";
    }

    if (diffHours < 48) {
      // Less than 2 days
      const hoursNeeded = 48 - diffHours;
      return `Duration must be at least 2 days. Current duration: ${diffDays} days, ${Math.floor(remainingHours)} hours, and ${Math.round(remainingMinutes)} minutes. Please add ${formatDuration(hoursNeeded, 0)} more.`;
    }

    // If valid, return the duration as an informative message
    return `Duration: ${diffDays} days, ${Math.floor(remainingHours)} hours, and ${Math.round(remainingMinutes)} minutes`;
  };

  // Custom input change handler with validation
  const handleInputChangeWithValidation = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    // Call the original onInputChange
    onInputChange(event);

    // Only perform validation if the auction is upcoming
    if (!isUpcoming) {
      setErrors({ title: "", start_time: "", end_time: "" });
      return;
    }

    // Perform validation based on field name
    if (name === "start_time") {
      const startTimeError = validateStartTime(value);
      const endTimeError = editingAuction?.end_time
        ? validateEndTime(value, editingAuction.end_time as string)
        : "";
      setErrors((prev) => ({
        ...prev,
        start_time: startTimeError,
        end_time: endTimeError,
      }));
    } else if (name === "end_time") {
      setErrors((prev) => ({
        ...prev,
        end_time: validateEndTime(editingAuction?.start_time as string, value),
      }));
    }
  };

  // Validate all fields on initial load and when editingAuction changes
  useEffect(() => {
    if (editingAuction) {
      fetchStaffList();

      setErrors({
        start_time: validateStartTime(editingAuction.start_time as string),
        end_time: validateEndTime(
          editingAuction.start_time as string,
          editingAuction.end_time as string,
        ),
      });
    }
  }, [editingAuction]);

  // Check if form has blocking errors
  const hasBlockingErrors = (): boolean => {
    if (!errors.title || errors.title.includes("must start with")) return false;
    if (errors.start_time?.includes("cannot be in the past")) return true;
    if (errors.end_time?.includes("must be at least")) return true;
    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Edit Auction: {editingAuction?.title}</DialogTitle>
      <DialogContent>
        {editingAuction && (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Auction Title"
              type="text"
              fullWidth
              variant="standard"
              value={editingAuction.title}
              onChange={handleInputChangeWithValidation}
              error={
                !!errors.title && !errors.title.includes("must start with")
              }
              helperText={errors.title}
            />
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
              value={formatDateForInput(editingAuction.start_time as string)}
              onChange={handleInputChangeWithValidation}
              error={
                !!errors.start_time && errors.start_time.includes("cannot")
              }
              helperText={errors.start_time}
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
              value={formatDateForInput(editingAuction.end_time as string)}
              onChange={handleInputChangeWithValidation}
              error={
                !!errors.end_time && !errors.end_time.includes("Duration:")
              }
              helperText={errors.end_time}
            />
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel id="auctioneer-select-label">Auctioneer</InputLabel>
              <Select
                labelId="auctioneer-select-label"
                id="auctioneer-select"
                name="auctioneer_id"
                value={editingAuction.auctioneer_id.toString() || ""}
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
            <div className="mt-5 flex flex-col justify-center">
              <Typography variant="h5" sx={{ mb: 3 }}>
                Kois in this auction
              </Typography>
              <AuctionKoiView
                auctionKois={auctionKois}
                handleEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
            <div className="mt-16"></div>
            {editingAuction.status === "ONGOING" && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleEndAuction(editingAuction.id)}
              >
                End Auction
              </Button>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editingAuction?.status === "UPCOMING" && (
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={hasBlockingErrors()}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditAuctionDialog;
