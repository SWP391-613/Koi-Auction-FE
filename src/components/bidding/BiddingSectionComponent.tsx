import React from "react";
import { TextField } from "@mui/material";
import { AuctionKoi } from "~/types/auctionkois.type";
import { Bid } from "~/components/BiddingHistory";
import BiddingHistory from "~/components/BiddingHistory";
import { formatCurrency } from "~/utils/currencyUtils";

interface BiddingSectionProps {
  isAuctionEnded: boolean;
  auctionKoi: AuctionKoi;
  bidAmount: number;
  setBidAmount: (amount: number) => void;
  handlePlaceBid: () => void;
  latestBid: Bid | null;
}

const BiddingSection: React.FC<BiddingSectionProps> = ({
  isAuctionEnded,
  auctionKoi,
  bidAmount,
  setBidAmount,
  handlePlaceBid,
  latestBid,
}) => {
  return (
    <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
      {!isAuctionEnded && !auctionKoi.is_sold ? (
        <div className="flex flex-col gap-2 rounded-2xl bg-[#F1F1F1] p-4">
          <h3 className="mb-2 text-xl font-semibold text-center">
            Place Your Bid
          </h3>
          <TextField
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            variant="outlined"
            placeholder="Enter bid amount"
            fullWidth
            inputProps={{
              style: { textAlign: "right" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "green",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "green",
                },
              },
            }}
          />
          <button
            onClick={handlePlaceBid}
            className="mt-2 w-full rounded-2xl bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Submit Bid
          </button>
        </div>
      ) : (
        <div className="mb-4 rounded-2xl bg-gray-200">
          <h3 className="mb-2 text-xl font-semibold">Auction Result</h3>
          <p>
            {auctionKoi.current_bid > 0 ? (
              `This koi has been sold for ${formatCurrency(auctionKoi.current_bid)}`
            ) : (
              <div className="bg-gray-300 p-4 rounded-2xl">
                <span>No bids were placed</span>
                <br />
                <span>This auction has ended without a sale.</span>
              </div>
            )}
          </p>
        </div>
      )}

      {auctionKoi.current_bid > 0 && (
        <>
          <h3 className="mb-2 text-xl font-semibold">Bid History</h3>
          <div className="rounded-2xl bg-gray-300 p-4 max-h-[50rem] overflow-auto">
            <div className="max-h-full overflow-auto">
              <BiddingHistory
                auctionKoiId={auctionKoi.id}
                latestBid={latestBid}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BiddingSection;
