export type AuctionDTO = {
  id?: number;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
};

export type AuctionModel = {
  id?: number;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  status: AUCTION_STATUS;
};

export type AUCTION_STATUS = "UPCOMING" | "ONGOING" | "ENDED";

