import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface VerifyPopupProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const VerifyPopup: React.FC<VerifyPopupProps> = ({ open, onClose, userId }) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate("/otp-verification");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verification Required</DialogTitle>
      <DialogContent>
        <p className="my-4">
          You need to verify your account to access this feature. Would you like
          to verify now?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleVerify} color="primary" variant="contained">
          Verify Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyPopup;
