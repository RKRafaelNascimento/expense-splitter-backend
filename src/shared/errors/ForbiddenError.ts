import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
  constructor(
    description = `You don't have permission to perform this action`,
    code = "GENERIC_ERROR",
  ) {
    super(
      description || `You don't have permission to perform this action`,
      "FORBIDDEN",
      code,
    );
  }
}
