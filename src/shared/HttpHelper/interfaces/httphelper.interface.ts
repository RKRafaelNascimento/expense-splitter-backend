import { IValidationError } from "@/shared/Validator/interfaces";

export interface IErrorResponse {
  description: string;
  statusCode: number;
  statusCodeAsString: string;
  code: string;
  validationErrors?: IValidationError[];
}

export interface ISucessResponse<T> {
  statusCode?: number;
  data?: T;
}
