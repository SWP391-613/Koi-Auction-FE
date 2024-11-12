// i dont want to change this because this related to many files in the project, so i will create new type KoiModel
export type KoiDetailModel = {
  id: number;
  name: string;
  sex: KoiGender | "";
  length: number;
  age: number;
  base_price: number;
  status_name: KoiTrackingStatus | "UNVERIFIED"; //if not any of the status, then default is unverified
  is_display: number; //0, 1
  thumbnail: string;
  description: string | null;
  owner_id: number;
  category_id: number;
  created_at?: string | Date;
  updated_at?: string | Date;
};

// KoiModel with 'gender' instead of 'sex'
// this type for creating new koi
export type KoiModel = Omit<KoiDetailModel, "sex"> & { gender: string };

export type AddNewKoiDTO = Omit<Omit<KoiDetailModel, "sex">, "id"> & {
  gender: string;
};

export type KoiTrackingStatus =
  | "UNVERIFIED"
  | "VERIFIED"
  | "REJECTED"
  | "PENDING"
  | "SOLD";

export type KoiGender = "Male" | "Female" | "Unknown";

export type KoiInAuctionDetailModel = KoiDetailModel & {
  auction_id: number;
  bid_method: BidMethod;
};

type BidMethod = "ASCENDING" | "DESCENDING" | "FIXED" | "SEALED";

export type KoiSearchResult = {
  total_page: number;
  total_item: number;
  item: KoiInAuctionDetailModel[];
};

export type UpdateKoiDTO = {
  id: number;
  age: number;
  base_price: number;
  category_id: number;
  description: string;
  name: string;
  is_display: number;
  length: number;
  owner_id: number;
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  status_name: KoiTrackingStatus;
  thumbnail: string;
};
