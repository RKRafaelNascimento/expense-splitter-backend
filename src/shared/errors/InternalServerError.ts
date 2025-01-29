import { HttpError } from "./HttpError";

export class InternalServerError extends HttpError {
  constructor(description = "Internal server error") {
    super(description, "INTERNAL_SERVER_ERROR", "INTERNAL_SERVER_ERROR");
  }
}
