export type AuctionDTO = {
  title: string;
  start_time: string;
  end_time: string;
  end_time_countdown: string;
  status: string;
  auctioneer_id: number;
};

export type AuctionModel = {
  id: number;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  end_time_countdown: Date | string;
  status: AUCTION_STATUS | string;
  auctioneer_id: number;
};

export type AddNewAuctionDTO = Omit<AuctionModel, "id" | "end_time_countdown">;

export type AUCTION_STATUS = "UPCOMING" | "ONGOING" | "ENDED";
