import { ErrorCodes } from "../enums";
import { IValidationError } from "../Validator/interfaces";
import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  /**
   * @constructor
   * @param {string} description - error description
   * @param {keyof typeof import('http-status-codes').StatusCodes} - The friendly name of the status code
   * @param {string} [code='GENERIC_ERROR'] - internal error code
   * @param {IValidationError[]} [validationErrors=[]] - schema validation errors
   */
  constructor(
    public description: string,
    public status: keyof typeof StatusCodes,
    public code: string = ErrorCodes.GENERIC,
    public validationErrors: IValidationError[] = [],
  ) {
    super(description);
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}
