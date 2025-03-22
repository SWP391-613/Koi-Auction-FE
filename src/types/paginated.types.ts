import { ApiResponse } from "./api.type";
import { CategoryModel } from "./categories.type";
import { KoiDetailModel, KoiInAuctionDetailModel } from "./kois.type";
import { Breeder, Member, Staff } from "./users.type";

export type PaginatedResponse<T> = {
  total_page: number;
  total_item: number;
  item: T[];
};

export type StaffsResponse = PaginatedResponse<Staff>;
export type MembersResponse = PaginatedResponse<Member>;
export type BreedersResponse = ApiResponse<Breeder[]>;
export type KoisResponse = PaginatedResponse<KoiDetailModel>;
export type KoiInAuctionResponse = PaginatedResponse<KoiInAuctionDetailModel>;
export type CategoryResponse = PaginatedResponse<CategoryModel>;
