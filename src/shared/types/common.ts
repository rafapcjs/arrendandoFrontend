// Common shared types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}