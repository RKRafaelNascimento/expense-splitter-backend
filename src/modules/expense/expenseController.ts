import { Request, Response } from "express";
import { ExpenseService } from ".";
import { IExpenseController, IExpenseData } from "./interfaces";
import { BadRequestError } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";
import { ValidatorService } from "@/shared/Validator";
import { ExpenseSchema } from "./schemas";
import { HttpHelpers } from "@/shared/HttpHelper";
import { ErrorCodes } from "@/shared/enums";

export class ExpenseController implements IExpenseController {
  constructor(
    private expenseService: ExpenseService,
    private validatorService: ValidatorService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      // @ts-expect-error ignore
      const { groupId, memberId } = req;

      const { value, error } = this.validatorService.validate<IExpenseData>(
        ExpenseSchema.createExpense,
        { ...req.body, groupId, memberId },
      );

      if (error) {
        throw new BadRequestError(
          "Missing or invalid parameters",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
          this.validatorService.formatErrorMessage(error),
        );
      }

      const expense = await this.expenseService.create(value);

      res.status(StatusCodes.CREATED).json(HttpHelpers.sucessResponse(expense));
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(response);
    }
  }
}
