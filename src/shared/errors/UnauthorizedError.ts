import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  constructor(
    public description = "User not authenticated",
    code = "GENERIC_ERROR",
  ) {
    super(description || "User not authenticated", "UNAUTHORIZED", code);
  }
}
