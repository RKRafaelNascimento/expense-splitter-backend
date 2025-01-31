import { Request, Response } from "express";
import { BalanceService } from ".";
import { StatusCodes } from "http-status-codes";
import { HttpHelpers } from "@/shared/HttpHelper";
import { BalanceSchema } from "./schemas";
import { BadRequestError } from "@/shared/errors";
import { ErrorCodes } from "@/shared/enums";
import { ValidatorService } from "@/shared/Validator";

export class BalanceController {
  constructor(
    private balanceService: BalanceService,
    private validatorService: ValidatorService,
  ) {}

  async getBalances(req: Request, res: Response): Promise<void> {
    try {
      const { value, error } = this.validatorService.validate<{
        groupId: number;
      }>(BalanceSchema.getAllBalances, {
        groupId: Number(req.params.groupId),
      });

      if (error) {
        throw new BadRequestError(
          "Missing or invalid parameters",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
          this.validatorService.formatErrorMessage(error),
        );
      }

      const balances = await this.balanceService.getAllBalancesByGroup(
        value.groupId,
      );

      res.status(StatusCodes.OK).json(balances);
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(response);
    }
  }
}
