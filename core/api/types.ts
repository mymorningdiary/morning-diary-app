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
