import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor(
    public description = "Resource Not Found",
    code = "GENERIC_ERROR",
  ) {
    super(description || "Resource Not Found", "NOT_FOUND", code);
  }
}
