export type BaseApiResponse = {
  message: string;
  status: number;
  code: number;
};

export type MDError = {
  status: number;
  code: number;
  message: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
};

export type ApiErrorResponse = {
  message: string;
  status: number;
  code: string;
};
