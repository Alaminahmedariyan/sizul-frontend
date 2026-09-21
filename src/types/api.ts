export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
};

export type ApiErrorDetail = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: ApiErrorDetail[];
  stack?: string;
};
