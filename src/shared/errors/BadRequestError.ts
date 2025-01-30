import { IValidationError } from "../Validator/interfaces/validator.interface";
import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  constructor(
    description = "Missing or invalid param",
    code = "GENERIC_ERROR",
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
