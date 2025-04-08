export type ApiResponse<T> = {
  data: T;
  code: number;
  message: string;
  status: number;
};

export type ApiErrorResponse = {
  message: string;
  status: number;
  code: string;
};
