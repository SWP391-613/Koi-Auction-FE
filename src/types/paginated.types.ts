import { CategoryModel } from "./categories.type";
import { KoiDetailModel, KoiInAuctionDetailModel } from "./kois.type";
import { Breeder, Member, Staff } from "./users.type";

type PaginatedMeta = {
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
};

export type PageResponse<T> = {
  status_code: number;
  message: string;
  is_success: boolean;
  data: T[];
  pagination: PaginatedMeta;
};

export type StaffsResponse = PageResponse<Staff>;
export type MembersResponse = PageResponse<Member>;
export type BreedersResponse = PageResponse<Breeder>;
export type KoisResponse = PageResponse<KoiDetailModel>;
export type KoiInAuctionResponse = PageResponse<KoiInAuctionDetailModel>;
export type CategoryResponse = PageResponse<CategoryModel>;
