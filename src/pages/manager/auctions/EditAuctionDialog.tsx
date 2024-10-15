import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import AuctionKoiView from "~/pages/manager/auctions/AuctionKoiView";

interface EditAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingAuction: AuctionModel | null;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  auctionKois: AuctionKoi[];
  onEdit: (koiId: number) => void;
  onDelete: (koiId: number) => void;
  formatDateForInput: (date: Date) => string;
}

const EditAuctionDialog: React.FC<EditAuctionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingAuction,
  onInputChange,
  auctionKois,
  onEdit,
  onDelete,
  formatDateForInput,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Edit Auction</DialogTitle>
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
              value={formatDateForInput(editingAuction.start_time as Date)}
              onChange={onInputChange}
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
              value={formatDateForInput(editingAuction.end_time as Date)}
              onChange={onInputChange}
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Kois in Auction</h3>
              <Button
                startIcon={<AddIcon />}
                onClick={() => alert("Add Koi")}
              />
              <div className="overflow-x-auto">
                <AuctionKoiView
                  auctionKois={auctionKois}
                  handleEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAuctionDialog;
