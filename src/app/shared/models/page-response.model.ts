export interface PageResponse<T> {
  content: T[];
  page: number;           // zero-based
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}