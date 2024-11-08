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
const auctionNeedCeilingPrice: string[] = ["DESCENDING_BID", "ASCENDING_BID"];

const AuctionKoiPopup: React.FC<AuctionKoiPopupProps> = ({
  open,
  onClose,
  koiId,
  auctionId,
  basePrice: originalBasePrice, // Rename the prop for clarity
  onSubmit,
}) => {
  const [bidStep, setBidStep] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(originalBasePrice);
  const [bidMethod, setBidMethod] = useState<BidMethod>("ASCENDING_BID");
  const [ceilPrice, setCeilPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [basePriceError, setBasePriceError] = useState<string>("");
  const [ceilPriceError, setCeilPriceError] = useState<string>("");

  useEffect(() => {
    if (bidStep < MIN_BID_STEP) {
      setErrorMessage(`Bid step must be at least $${MIN_BID_STEP}.`);
    } else {
      setErrorMessage("");
    }
  }, [bidStep]);

  useEffect(() => {
    // Check if the new base price is less than the original base price
    if (basePrice < originalBasePrice) {
      setBasePriceError(
        `Price must be greater than or equal to the original price of $${originalBasePrice}.`,
      );
    } else {
      setBasePriceError("");
    }
  }, [basePrice, originalBasePrice]);

  useEffect(() => {
    // Check if the ceiling price is less than the current base price
    if (ceilPrice > 0 && ceilPrice <= basePrice) {
      setCeilPriceError(
        `Ceiling price must be greater than the current base price of $${basePrice}.`,
      );
    } else {
      setCeilPriceError("");
    }
  }, [ceilPrice, basePrice]);

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
          maxWidth: 500,
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
          label="Base Price ($)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          placeholder="Enter base price ($)"
          error={!!basePriceError} // Show error if base price error exists
        />
        {basePriceError && (
          <FormHelperText error>{basePriceError}</FormHelperText>
        )}

        <TextField
          label="Bid Step ($)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={bidStep}
          onChange={(e) => setBidStep(Number(e.target.value))}
          placeholder="Enter bid step  ($)"
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
          label="Ceiling Price ($)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ceilPrice}
          onChange={(e) => setCeilPrice(Number(e.target.value))}
          placeholder="Enter ceiling price ($)"
          InputProps={{
            readOnly: !auctionNeedCeilingPrice.includes(bidMethod),
          }}
          error={!!ceilPriceError}
        />
        {ceilPriceError && (
          <FormHelperText error>{ceilPriceError}</FormHelperText>
        )}

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
            disabled={!!errorMessage || !!basePriceError} // Disable submit if there's an error
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
