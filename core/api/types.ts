export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code: number;
}
