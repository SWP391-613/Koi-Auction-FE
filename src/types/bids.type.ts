// Define the interface for checking AuctionKoi is On-going
export interface BiddingHistoryProps {
  auctionKoiId: number;
  latestBid: Bid | null;
}
// Define the interface for the bid history
export interface Bid {
  auction_koi_id: number;
  bidder_id: number;
  bid_amount: number;
  bid_time: string;
  bidder_name: string;
}
