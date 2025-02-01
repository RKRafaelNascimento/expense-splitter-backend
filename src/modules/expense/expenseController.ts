import { Request, Response } from "express";
import { ExpenseService } from ".";
import { IExpenseController, IExpenseData } from "./interfaces";
import { BadRequestError } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";
import { ValidatorService } from "@/shared/Validator";
import { ExpenseSchema } from "./schemas";
import { HttpHelpers } from "@/shared/HttpHelper";
import { ErrorCodes } from "@/shared/enums";
import { IFileService } from "@/shared/FileService/interfaces";
import { awsBucketExpenseBatch } from "@/config";

export class ExpenseController implements IExpenseController {
  constructor(
    private expenseService: ExpenseService,
    private validatorService: ValidatorService,
    private fileService: IFileService,
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

  async uploadCsv(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError(
          "No file uploaded",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
        );
      }

      const filePath = req.file.path;
      const fileName = `expenses/${Date.now()}_${req.file.originalname}`;

      const s3Url = await this.fileService.uploadFile({
        fileName,
        filePath,
        bucketName: awsBucketExpenseBatch,
        mimeType: "text/csv",
      });

      res.status(StatusCodes.CREATED).json(HttpHelpers.sucessResponse(s3Url));
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(response);
    }
  }
}
