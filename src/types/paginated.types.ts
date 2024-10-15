import { KoiDetailModel } from "./kois.type";
import { Breeder, Member, Staff } from "./users.type";

export type PaginatedResponse<T> = {
  total_page: number;
  total_item: number;
  item: T[];
};

export type StaffsResponse = PaginatedResponse<Staff>;
export type MembersResponse = PaginatedResponse<Member>;
export type BreedersResponse = PaginatedResponse<Breeder>;
export type KoisResponse = PaginatedResponse<KoiDetailModel>;
