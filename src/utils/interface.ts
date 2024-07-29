export interface IResponse {
  statusCode: number;
  message: string;
}
export interface IResponseSuccess extends IResponse {
  data: any;
}

export interface IResponseError extends IResponse {
  error: any;
}
