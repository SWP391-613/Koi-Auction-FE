import React from "react";
import { Popper, Paper, Typography, ClickAwayListener } from "@mui/material";

interface RulesPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const BiddingRulesPopup: React.FC<RulesPopupProps> = ({
  open,
  onClose,
  anchorEl,
}) => {
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
            Bidding Rules
          </Typography>
          <p className="font-bold text-gray-600">
            - Our Platform held auctions with 3 different methods: Ascending
            Bid, Descending Bid, and Fixed Price Method.
          </p>
          <p className="font-bold text-gray-600">
            - Anyone can participate in the auction and view realtime updates on
            the auction & bidding information.
          </p>
          <p className="font-bold text-gray-600">
            - Only the Registered Members (except Breeder account) can bid on
            the auction.
          </p>
          <hr className="my-2" />
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li className="font-bold">For Ascending Bid Methods:</li>
            <p>
              - Members may bid multiple times, and the highest bidder at the
              auction's close or the first to meet or exceed the ceiling price
              will be declared the winner.
            </p>
            <p>
              - The bid step is the minimum amount by which a bid must be
              raised.
            </p>
          </ul>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
            <li className="font-bold">For Descending Bid Method:</li>
            <p>
              - The price starts at a ceiling price and decreases at a
              predetermined rate until a buyer is found.
            </p>
            <p>
              - The first buyer to meet or exceed the current price will be
              declared the winner.
            </p>
          </ul>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
            <li className="font-bold">For Fixed Price Method:</li>
            <p>
              - The price is fixed and the first buyer to meet or exceed the
              fixed price will be declared the winner.
            </p>
          </ul>
          <hr className="my-4" />
          <Typography variant="body2" className="mt-2 text-green-600">
            Note: Make sure you have enough balance in your account to bid on
            the auction.
          </Typography>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default BiddingRulesPopup;
