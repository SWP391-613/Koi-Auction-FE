import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { AuctionModel } from "~/types/auctions.type";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { format } from "date-fns";
import { Staff } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import { useNavigate } from "react-router-dom";

interface StaffApiResponse {
  total_page: number;
  total_item: number;
  item: Staff[];
}

interface AddAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newAuction: Partial<AuctionModel>;
  onInputChange: (name: string, value: unknown) => void;
}

const AddAuctionDialog: React.FC<AddAuctionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  newAuction,
  onInputChange,
}) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(10); // You can adjust this value as needed
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onInputChange(event.target.name, event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    onInputChange(event.target.name as string, event.target.value);
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
        "http://localhost:4000/api/v1/staffs",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: page,
            limit: itemsPerPage,
          },
        },
      );
      setStaffList(response.data.item);
      setTotalPages(response.data.total_page);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (!newAuction.start_time) {
        onInputChange("start_time", defaultStartTime);
      }

      fetchStaffList();
    }
  }, [
    open,
    newAuction.start_time,
    defaultStartTime,
    onInputChange,
    navigate,
    page,
  ]);

  return (
    <Dialog open={open} onClose={onClose}>
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
          value={newAuction.title || ""}
          onChange={handleTextFieldChange}
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
          value={newAuction.start_time || ""}
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
          value={newAuction.end_time || ""}
          onChange={handleTextFieldChange}
          InputProps={{
            inputProps: {
              min: newAuction.start_time || defaultStartTime,
            },
          }}
        />
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
            value={newAuction.auctioneer_id || ""}
            onChange={handleSelectChange}
            label="Auctioneer"
          >
            {staffList.map((staff, index) => (
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
        <Button onClick={onSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAuctionDialog;
