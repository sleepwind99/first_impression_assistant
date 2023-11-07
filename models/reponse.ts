import { ResponseError } from "./error";

export interface HttpResponse {
  code: number; // HTTP Code
  description: string; // Description of Reponse
}

export interface ErrorResponse extends HttpResponse {
  error: ResponseError; // Response Error
}

export const isErrorResponse = (obj: any): obj is ErrorResponse => {
  return "error" in obj && "code" in obj && "description" in obj;
};

export interface DataResponse extends HttpResponse {
  data: any; // Response Error
}
