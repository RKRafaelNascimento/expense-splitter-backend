import { Request, Response } from "express";
import { PaymentService } from ".";
import { HttpHelpers } from "@/shared/HttpHelper";
import { ErrorCodes } from "@/shared/enums";
import { PaymentSchema } from "./schemas";
import { IPaymentData } from "./interfaces/payment.interface";
import { BadRequestError } from "@/shared/errors";
import { ValidatorService } from "@/shared/Validator";
import { StatusCodes } from "http-status-codes";

export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private validatorService: ValidatorService,
  ) {}

  async payExpense(req: Request, res: Response) {
    try {
      // @ts-expect-error ignore
      const { groupId, memberId } = req;

      const { value, error } = this.validatorService.validate<IPaymentData>(
        PaymentSchema.payExpense,
        { ...req.body, groupId, memberId },
      );

      if (error) {
        throw new BadRequestError(
          "Missing or invalid parameters",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
          this.validatorService.formatErrorMessage(error),
        );
      }

      await this.paymentService.payExpense(value);

      res.status(StatusCodes.NO_CONTENT).json(
        HttpHelpers.sucessResponse({
          message: "Payment successfully completed",
        }),
      );
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(response);
    }
  }
}
