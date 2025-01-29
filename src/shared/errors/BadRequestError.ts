import { ErrorCodes } from "../enums";
import { IValidationError } from "../Validator/interfaces/validator.interface";
import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  constructor(
    description = "Missing or invalid param",
    code = ErrorCodes.GENERIC,
    validationErrors?: IValidationError[],
  ) {
    super(
      description || "Missing or invalid param",
      "BAD_REQUEST",
      code,
      validationErrors,
    );
  }
}
