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

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
}
