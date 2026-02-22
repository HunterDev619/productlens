export type BaseResponse<T> = {
  error: string | number;
  message: string;
  data: T;
};
