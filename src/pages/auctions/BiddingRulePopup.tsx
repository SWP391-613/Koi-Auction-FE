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
            Auction Bidding Guidelines
          </Typography>

          <div className="text-gray-600 space-y-4">
            <section className="space-y-2">
              <h3 className="font-bold">General Rules</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Our platform supports three auction formats: Ascending-Price,
                  Descending-Price, and Fixed-Price auctions.
                </li>
                <li>
                  All visitors can view real-time auction information and
                  bidding activities.
                </li>
                <li>
                  Only registered members (excluding Breeder accounts) are
                  eligible to place bids.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold">Ascending-Price Auction</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Bidders may submit multiple bids throughout the auction
                  duration.
                </li>
                <li>
                  The auction concludes when either:
                  <ul className="list-circle pl-6 mt-1">
                    <li>The auction time expires (highest bidder wins)</li>
                    <li>
                      A bid meets or exceeds the ceiling price (first qualifier
                      wins)
                    </li>
                  </ul>
                </li>
                <li>
                  Each new bid must exceed the current highest bid by at least
                  the specified bid increment.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold">Descending-Price Auction</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The auction begins at a ceiling price and decreases at fixed
                  intervals.
                </li>
                <li>
                  The first bidder to accept the current price wins the auction.
                </li>
                <li>
                  Once a valid bid is placed, the auction ends immediately.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold">Fixed-Price Auction</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>The item is offered at a non-negotiable price.</li>
                <li>
                  The first bidder to accept the fixed price wins the auction.
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <Typography variant="body2" className="text-green-700 font-medium">
              Important: Before placing a bid, please ensure your account has
              sufficient funds to cover your maximum bid amount plus any
              applicable fees.
            </Typography>
          </div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default BiddingRulesPopup;
