export interface Koi {
  id: number;
  name: string;
  sex: string;
  length: number;
  age: number;
  status_name: string;
  is_display: number;
  thumbnail: string;
  description: string;
  owner_id: number;
  category_id: number;
}

export interface KoiApiResponse {
  total_page: number;
  total_item: number;
  items: Koi[];
}
