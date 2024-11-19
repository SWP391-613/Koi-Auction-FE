import React from "react";
import { Popper, Paper, Typography, ClickAwayListener } from "@mui/material";

interface RulesPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const RulesPopup: React.FC<RulesPopupProps> = ({ open, onClose, anchorEl }) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="right-start"
      style={{
        zIndex: 1500,
        width: "500px",
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper
          className="p-6 bg-white rounded-lg shadow-md"
          sx={{
            width: "100%",
            position: "relative",
            outline: "none",
            marginTop: "8px",
          }}
        >
          <Typography variant="h6" className="mb-4 font-bold text-gray-800">
            Registration Rules
          </Typography>
          <p className="mb-2 font-bold text-gray-600">
            - Base price must be greater than or equal to Koi's original base
            price
          </p>
          <p className="mb-2 font-bold text-gray-600">
            - Base price must not be greater than 50.000.000 VND
          </p>
          <hr className="my-2" />
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li className="font-bold">
              For Ascending Bid & Descending Bid Methods:
            </li>
            <p>- Bid step must be at least 50.000 VND.</p>
            <p>
              - Ceiling price is required & greater than base price + 10 times
              of bid step.
            </p>
          </ul>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
            <li className="font-bold">For Fixed Price Bid Method:</li>
            <p>- Bid step and ceiling price not required.</p>
          </ul>
          <hr className="my-4" />
          <Typography variant="body2" className="mt-2 text-green-600">
            Note: We will charge 10% of the base price as a service fee, please
            check this info clearly before submitting your auction. You cannot
            undo after submitting.
          </Typography>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default RulesPopup;
