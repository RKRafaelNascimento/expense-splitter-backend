import { HttpError, InternalServerError } from "@/shared/errors";
import { IErrorResponse, ISucessResponse } from "./interfaces";
import { StatusCodes } from "http-status-codes";

export class HttpHelpers {
  static errorResponse(error: IErrorResponse): IErrorResponse {
    const response: IErrorResponse = {
      code: error.code,
      statusCode: error.statusCode,
      statusCodeAsString: error.statusCodeAsString,
      description: error.description,
    };

    if (error.validationErrors && error.validationErrors.length > 0) {
      response.validationErrors = error.validationErrors;
    }

    return response;
  }

  static sucessResponse<T>(data: T, statusCode?: number): ISucessResponse<T> {
    return {
      statusCode,
      ...data,
    };
  }

  static handleError(error: IErrorResponse | unknown): IErrorResponse {
    if (error instanceof HttpError) {
      return HttpHelpers.errorResponse({
        statusCode: StatusCodes[error.status],
        code: error.code,
        statusCodeAsString: error.status,
        description: error.description,
        validationErrors: error.validationErrors,
      });
    }

    const internalServerError = new InternalServerError();
    return HttpHelpers.errorResponse({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      code: internalServerError.code,
      statusCodeAsString: internalServerError.status,
      description: internalServerError.description,
    });
  }
}
