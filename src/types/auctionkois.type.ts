import { KoiDetailModel } from "./kois.type";

export type AuctionKoi = {
  id: number;
  auction_id: number;
  koi_id: number;
  base_price: number;
  current_bid: number;
  current_bidder_id: number | null;
  is_sold: boolean;
  bid_method: string;
  bid_step: number;
};

export type BidMethod = "FIXED_PRICE" | "DESCENDING_BID" | "ASCENDING_BID";

export interface KoiWithAuctionKoiData extends KoiDetailModel {
  auctionKoiData: AuctionKoi;
}
