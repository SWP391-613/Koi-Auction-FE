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
const numberRegex = /^[1-9]\d*$/;

const inputValidator = {
  pattern: "\\d*",
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.ctrlKey && e.key === "a") {
      return; // Allow Ctrl+A
    }

    // Prevent decimal point
    if (
      !/[0-9]/.test(e.key) && // Not a digit
      e.key !== "Backspace" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      // Not a digit) {
      e.preventDefault();
    }
  },
};

const AuctionKoiPopup: React.FC<AuctionKoiPopupProps> = ({
  open,
  onClose,
  koiId,
  auctionId,
  basePrice: originalBasePrice, // Rename the prop for clarity
  onSubmit,
}) => {
  const [bidStep, setBidStep] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [bidMethod, setBidMethod] = useState<BidMethod>("ASCENDING_BID");
  const [ceilPrice, setCeilPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [basePriceError, setBasePriceError] = useState<string>("");
  const [ceilPriceError, setCeilPriceError] = useState<string>("");
  const [feePriceMessage, setFeePriceMessage] = useState<string>("");
  const [showRules, setShowRules] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "basePrice" | "bidStep" | "ceilPrice",
  ) => {
    const value = e.target.value;

    // Common validation function
    const validateInput = (stringValue: string) => {
      // Convert to number, defaulting to 0 if empty
      const numValue = stringValue === "" ? 0 : Number(stringValue);

      if (numValue < 0) {
        setCeilPriceError("Ceil Price must be greater than 0.");
        return false;
      }

      switch (field) {
        case "basePrice":
          // Ensure base price is within valid range
          if (numValue < originalBasePrice) {
            setBasePriceError(
              `Price must be greater than or equal to the original price of ${formatCurrency(originalBasePrice)}.`,
            );
            return false;
          }
          if (numValue > MAX_BASE_PRICE) {
            setBasePriceError(
              `Price cannot exceed ${formatCurrency(MAX_BASE_PRICE)}.`,
            );
            return false;
          }

          setBasePriceError("");
          return true;

        case "bidStep":
          // Validate bid step for non-fixed price methods
          if (bidMethod !== "FIXED_PRICE" && numValue < MIN_BID_STEP) {
            setErrorMessage(
              `Bid step must be at least ${formatCurrency(MIN_BID_STEP)}.`,
            );
            return false;
          }

          setErrorMessage("");
          return true;

        case "ceilPrice":
          // Skip ceiling price validation for FIXED_PRICE
          if (bidMethod === "FIXED_PRICE") {
            setCeilPriceError("");
            return true;
          }

          // Convert base price and bid step to numbers, defaulting to 0
          const currentBasePrice = basePrice === "" ? 0 : Number(basePrice);
          const currentBidStep = bidStep === "" ? 0 : Number(bidStep);

          // Validate ceiling price
          if (
            numValue > 0 &&
            numValue < currentBasePrice + 10 * currentBidStep
          ) {
            setCeilPriceError(
              `Ceiling price must be greater than ${formatCurrency(currentBasePrice + 10 * currentBidStep)} (base price + 10 times of bid step).`,
            );
            return false;
          }

          // Require ceiling price for ascending/descending bid methods
          if (
            (bidMethod === "ASCENDING_BID" || bidMethod === "DESCENDING_BID") &&
            numValue === 0
          ) {
            setCeilPriceError(
              `Ceiling price is required for ${bidMethod} bid method.`,
            );
            return false;
          }

          setCeilPriceError("");
          return true;

        default:
          return true;
      }
    };

    // Handle input for specific fields
    switch (field) {
      case "basePrice":
        setBasePrice(value);
        validateInput(value);
        break;
      case "bidStep":
        setBidStep(value);
        validateInput(value);
        break;
      case "ceilPrice":
        setCeilPrice(value);
        validateInput(value);
        break;
    }
  };

  useEffect(() => {
    const bidStepNum = bidStep === "" ? 0 : Number(bidStep);
    const basePriceNum = basePrice === "" ? 0 : Number(basePrice);

    if (bidMethod !== "FIXED_PRICE" && bidStepNum < MIN_BID_STEP) {
      setErrorMessage(
        `Bid step must be at least ${formatCurrency(MIN_BID_STEP)}.`,
      );
    } else if (bidStepNum >= basePriceNum) {
      setErrorMessage(`Bid step must be less than base price.`);
    } else {
      setErrorMessage("");
    }
  }, [bidStep, bidMethod]); // Add bidMethod to dependencies

  useEffect(() => {
    const basePriceNum = basePrice === "" ? 0 : Number(basePrice);

    // Check if the base price is within valid range
    if (basePriceNum < originalBasePrice) {
      setBasePriceError(
        `Price must be greater than or equal to the original price of ${formatCurrency(originalBasePrice)}.`,
      );
    } else if (basePriceNum > MAX_BASE_PRICE) {
      setBasePriceError(
        `Price cannot exceed ${formatCurrency(MAX_BASE_PRICE)}.`,
      );
    } else {
      setBasePriceError("");
    }
  }, [basePrice, originalBasePrice]);

  useEffect(() => {
    const basePriceNum = basePrice === "" ? 0 : Number(basePrice);

    if (!basePriceError && basePriceNum >= originalBasePrice) {
      const fee = Math.floor(basePriceNum * 0.1);
      setFeePriceMessage(
        `*We will charge 10% of the base price (${formatCurrency(fee)}) as registration fee.*`,
      );
    } else {
      setFeePriceMessage("");
    }
  }, [basePrice, basePriceError, originalBasePrice]);

  const handleSubmit = () => {
    const basePriceNum = basePrice === "" ? 0 : Number(basePrice);
    const bidStepNum = bidStep === "" ? 0 : Number(bidStep);
    const ceilPriceNum = ceilPrice === "" ? 0 : Number(ceilPrice);

    // Only check bidStep and ceilPrice errors for non-FIXED_PRICE methods
    if (bidMethod === "FIXED_PRICE") {
      if (!basePriceError) {
        onSubmit(basePriceNum, 0, bidMethod, 0);
      }
    } else {
      if (!errorMessage && !basePriceError && !ceilPriceError) {
        onSubmit(basePriceNum, bidStepNum, bidMethod, ceilPriceNum);
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
      setBidStep("0");
      setCeilPrice("0");
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
          onChange={(e) => handleInputChange(e, "basePrice")}
          placeholder="Enter base price (VND)"
          error={!!basePriceError}
          inputProps={inputValidator}
        />
        {basePriceError && (
          <FormHelperText error>{basePriceError}</FormHelperText>
        )}
        {feePriceMessage && Number(basePrice) >= originalBasePrice && (
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
          onChange={(e) => handleInputChange(e, "bidStep")}
          placeholder="Enter bid step (VND)"
          error={!!errorMessage}
          disabled={bidMethod === "FIXED_PRICE"}
          inputProps={inputValidator}
        />
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}

        <TextField
          label="Ceiling Price (VND)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ceilPrice}
          onChange={(e) => handleInputChange(e, "ceilPrice")}
          placeholder="Enter ceiling price (VND)"
          disabled={bidMethod === "FIXED_PRICE"}
          error={!!ceilPriceError}
          inputProps={inputValidator}
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
