import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material"; // Ensure you have Material-UI installed
import { BidMethod } from "~/types/auctionkois.type";

interface AuctionKoiPopupProps {
  open: boolean;
  onClose: () => void;
  koiId: number;
  auctionId: number;
  basePrice: number;
  onSubmit: (
    basePrice: number,
    bidStep: number,
    bidMethod: BidMethod,
    ceilPrice: number,
  ) => void;
}

const MIN_BID_STEP = 5;

const AuctionKoiPopup: React.FC<AuctionKoiPopupProps> = ({
  open,
  onClose,
  koiId,
  auctionId,
  basePrice,
  onSubmit,
}) => {
  const [bidStep, setBidStep] = useState<number>(0);
  const [bidMethod, setBidMethod] = useState<BidMethod>("ASCENDING_BID");
  const [ceilPrice, setCeilPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (bidStep < MIN_BID_STEP) {
      setErrorMessage(`Bid step must be at least $${MIN_BID_STEP}.`);
    } else {
      setErrorMessage("");
    }
  }, [bidStep]);

  const handleSubmit = () => {
    if (!errorMessage) {
      onSubmit(basePrice, bidStep, bidMethod, ceilPrice);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 4,
          background: "#fff",
          borderRadius: 2,
          maxWidth: 400,
          margin: "auto",
          marginTop: "100px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Register Koi for Auction
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Koi ID: {koiId}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Auction ID: {auctionId}
        </Typography>

        <TextField
          label="Base Price"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={basePrice}
          InputProps={{ readOnly: true }} // Make it read-only
        />

        <TextField
          label="Bid Step"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={bidStep}
          onChange={(e) => setBidStep(Number(e.target.value))}
          placeholder="Enter bid step"
          error={!!errorMessage} // Show error if exists
        />
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}

        <TextField
          label="Bid Method"
          select
          variant="outlined"
          fullWidth
          margin="normal"
          value={bidMethod}
          onChange={(e) => setBidMethod(e.target.value as BidMethod)}
        >
          <MenuItem value="ASCENDING_BID">Ascending Bid</MenuItem>
          <MenuItem value="DESCENDING_BID">Descending Bid</MenuItem>
          <MenuItem value="SEALED_BID">Sealed Bid</MenuItem>
          <MenuItem value="FIXED_PRICE">Fixed Price</MenuItem>
        </TextField>

        <TextField
          label="Ceiling Price"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ceilPrice}
          onChange={(e) => setCeilPrice(Number(e.target.value))}
          placeholder="Enter ceiling price"
          InputProps={{
            readOnly: bidMethod !== "DESCENDING_BID", // Read-only unless descending
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ ":hover": { backgroundColor: "#4caf50" } }}
            onClick={handleSubmit}
            disabled={!!errorMessage} // Disable submit if there's an error
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ":hover": { backgroundColor: "#f44336" } }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuctionKoiPopup;
