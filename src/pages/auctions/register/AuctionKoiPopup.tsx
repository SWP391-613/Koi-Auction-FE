import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"; // Ensure you have Material-UI installed
import React, { useEffect, useState } from "react";
import { BidMethod } from "~/types/auctionkois.type";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Add this import
import RulesPopup from "./RulePopup";
import { formatCurrency } from "~/utils/currencyUtils";

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

const MIN_BID_STEP = 50000;
const auctionNeedCeilingPrice: string[] = ["DESCENDING_BID", "ASCENDING_BID"];
const MAX_BASE_PRICE = 50000000;

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
  const [feePriceMessage, setFeePriceMessage] = useState<string>("");
  const [showRules, setShowRules] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (bidMethod !== "FIXED_PRICE" && bidStep < MIN_BID_STEP) {
      setErrorMessage(
        `Bid step must be at least ${formatCurrency(MIN_BID_STEP)}.`,
      );
    } else {
      setErrorMessage("");
    }
  }, [bidStep, bidMethod]); // Add bidMethod to dependencies

  useEffect(() => {
    // Check if the base price is within valid range
    if (basePrice < originalBasePrice) {
      setBasePriceError(
        `Price must be greater than or equal to the original price of ${formatCurrency(originalBasePrice)}.`,
      );
    } else if (basePrice > MAX_BASE_PRICE) {
      setBasePriceError(
        `Price cannot exceed ${formatCurrency(MAX_BASE_PRICE)}.`,
      );
    } else {
      setBasePriceError("");
    }
  }, [basePrice, originalBasePrice]);

  useEffect(() => {
    if (!basePriceError && basePrice >= originalBasePrice) {
      const fee = Math.floor(basePrice * 0.1);
      setFeePriceMessage(
        `*We will charge 10% of the base price (${formatCurrency(fee)}) as registration fee.*`,
      );
    } else {
      setFeePriceMessage("");
    }
  }, [basePrice, basePriceError, originalBasePrice]);

  useEffect(() => {
    // Skip ceiling price validation for FIXED_PRICE
    if (bidMethod === "FIXED_PRICE") {
      setCeilPriceError("");
      return;
    }

    if (ceilPrice > 0 && ceilPrice < basePrice + 10 * bidStep) {
      setCeilPriceError(
        `Ceiling price must be greater than ${formatCurrency(basePrice + 10 * bidStep)} (base price + 10 times of bid step).`,
      );
    } else if (
      (bidMethod === "ASCENDING_BID" || bidMethod === "DESCENDING_BID") &&
      ceilPrice === 0
    ) {
      setCeilPriceError(
        `Ceiling price is required for ${bidMethod} bid method.`,
      );
    } else {
      setCeilPriceError("");
    }
  }, [ceilPrice, basePrice, bidMethod, bidStep]);

  const handleSubmit = () => {
    // Only check bidStep and ceilPrice errors for non-FIXED_PRICE methods
    if (bidMethod === "FIXED_PRICE") {
      if (!basePriceError) {
        onSubmit(basePrice, 0, bidMethod, 0);
      }
    } else {
      if (!errorMessage && !basePriceError && !ceilPriceError) {
        onSubmit(basePrice, bidStep, bidMethod, ceilPrice);
      }
    }
  };

  const handleHelpMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setShowRules(true);
  };

  const handleHelpMouseLeave = () => {
    setShowRules(false);
    setAnchorEl(null);
  };

  const handleBidMethodChange = (newMethod: BidMethod) => {
    setBidMethod(newMethod);

    // Reset bid step and ceiling price if FIXED_PRICE is selected
    if (newMethod === "FIXED_PRICE") {
      setBidStep(0);
      setCeilPrice(0);
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
          position: "relative", // Add this
        }}
      >
        {/* Add Help Icon */}
        <div
          onMouseEnter={handleHelpMouseEnter}
          onMouseLeave={handleHelpMouseLeave}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            className="font-bold"
          >
            Rules of registration &nbsp;
            <Tooltip title="Rules">
              <HelpOutlineIcon color="primary" />
            </Tooltip>
          </Typography>
        </div>

        {/* Rules Popup */}
        {showRules && anchorEl && (
          <RulesPopup
            open={showRules}
            onClose={() => setShowRules(false)}
            anchorEl={anchorEl}
          />
        )}

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
          label="Bid Method"
          select
          variant="outlined"
          fullWidth
          margin="normal"
          value={bidMethod}
          onChange={(e) => handleBidMethodChange(e.target.value as BidMethod)}
        >
          <MenuItem value="ASCENDING_BID">Ascending Bid</MenuItem>
          <MenuItem value="DESCENDING_BID">Descending Bid</MenuItem>
          <MenuItem value="FIXED_PRICE">Fixed Price</MenuItem>
        </TextField>

        <TextField
          label="Base Price (VND)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          placeholder="Enter base price (VND)"
          error={!!basePriceError}
          inputProps={{
            step: "5000",
            max: MAX_BASE_PRICE,
            min: originalBasePrice,
          }}
        />
        {basePriceError && (
          <FormHelperText error>{basePriceError}</FormHelperText>
        )}
        {feePriceMessage && basePrice >= originalBasePrice && (
          <FormHelperText sx={{ color: "green" }}>
            {feePriceMessage}
          </FormHelperText>
        )}

        <TextField
          label="Bid Step (VND)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={bidStep}
          onChange={(e) => setBidStep(Number(e.target.value))}
          placeholder="Enter bid step (VND)"
          error={!!errorMessage}
          disabled={bidMethod === "FIXED_PRICE"}
        />
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}

        <TextField
          label="Ceiling Price (VND)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ceilPrice}
          onChange={(e) => setCeilPrice(Number(e.target.value))}
          placeholder="Enter ceiling price (VND)"
          disabled={bidMethod === "FIXED_PRICE"}
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
            disabled={
              bidMethod === "FIXED_PRICE"
                ? !!basePriceError
                : !!errorMessage || !!basePriceError || !!ceilPriceError
            }
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
