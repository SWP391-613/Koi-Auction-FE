import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AuctionModel } from "~/types/auctions.type";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { format, startOfDay } from "date-fns"; // Import necessary functions from date-fns

interface AddAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newAuction: Partial<AuctionModel>;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddAuctionDialog: React.FC<AddAuctionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  newAuction,
  onInputChange,
}) => {
  // Get today's date in the required format for datetime-local
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm"); // Format to YYYY-MM-DDTHH:MM
  };

  const [defaultStartTime] = useState(getCurrentDateTime());

  useEffect(() => {
    if (open) {
      // Set start_time if not already set
      if (!newAuction.start_time) {
        onInputChange({
          target: { name: "start_time", value: defaultStartTime },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [open, newAuction.start_time, defaultStartTime, onInputChange]);

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
          onChange={onInputChange}
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
          onChange={onInputChange}
          InputProps={{
            inputProps: {
              min: defaultStartTime, // Prevent selecting past dates/times
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
          onChange={onInputChange}
          InputProps={{
            inputProps: {
              min: newAuction.start_time || defaultStartTime, // Prevent selecting past dates/times and ensure end_time is after start_time
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
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          name="auctioneer_id"
          label="Auctioneer ID"
          type="text"
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={newAuction.auctioneer_id || ""}
          onChange={onInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAuctionDialog;
