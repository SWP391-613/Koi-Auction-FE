export type AuctionDTO = {
  id?: number;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  auctioneer_id: number;
};

export type AuctionModel = {
  id?: number;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  status: AUCTION_STATUS;
  auctioneer_id: number;
};

export type AUCTION_STATUS = "UPCOMING" | "ONGOING" | "ENDED";
