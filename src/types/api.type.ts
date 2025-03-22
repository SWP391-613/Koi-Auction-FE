export type ApiResponse<T> = {
  message: string;
  data: T;
  status_code?: number;
  is_success?: boolean;
  pagination?: PaginationMeta;
  reason?: string;
};

export type PaginationMeta = {
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
};
