export interface KoisResponse {
  total_page: number;
  total_item: number;
  items: KoiDetailModel[];
}
export interface KoiDetailModel {
  id: number;
  name: string;
  sex: string;
  length: number;
  age: number;
  status_name: string;
  is_display: number; //0, 1
  thumbnail: string;
  description: string;
  owner_id: number;
  category_id: number;
}
