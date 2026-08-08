export interface PageRequest {
  page?: number;          // zero-based
  size?: number;
  sort?: string[];        // e.g. ['name,asc', 'rollNo,desc']
}