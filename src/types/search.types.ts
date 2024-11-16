export type BidMethod =
  | "All"
  | "Fixed Price"
  | "Descending Bid"
  | "Ascending Bid";

export interface BaseFilterValues {
  type: "koi" | "auction";
  search: string;
  bidMethod: BidMethod;
}

export interface KoiFilterValues extends BaseFilterValues {
  type: "koi";
  category: string;
  gender: string;
  minSize: number;
  maxSize: number;
  minAge: number;
  maxAge: number;
  priceRange: [number, number];
}

export interface AuctionFilterValues extends BaseFilterValues {
  type: "auction";
}

export type FilterValues = KoiFilterValues | AuctionFilterValues;
