import { Message } from "@aws-sdk/client-sqs";
import { Logger } from "@/shared/Logger";
import { ExpenseParser } from "./expenseParser";
import { IFileService } from "@/shared/FileService/interfaces";
import { IQueueService } from "@/shared/QueueService/interfaces";
import { IExpenseService } from "@/modules/expense/interfaces";
import { IValidatorService } from "@/shared/Validator/interfaces";
import { ExpenseBatchProcessorSchema } from "./schemas";
import { expenseBatchProcessorCodes } from "./error";
import {
  BadRequestError,
  HttpError,
  InternalServerError,
} from "@/shared/errors";
import { IExpenseBatchProcessorData } from "./interfaces";

export class ExpenseBatchProcessor {
  private logger = Logger.getInstance();

  constructor(
    private fileService: IFileService,
    private queueService: IQueueService,
    private expenseService: IExpenseService,
    private validatorService: IValidatorService,
  ) {}

  async processQueue(): Promise<void> {
    this.logger.info({ msg: "Listening to SQS queue..." });
    try {
      const message = 1;
      const WaitTimeSeconds = 20;

      const messages: Message[] = await this.queueService.consume(
        message,
        WaitTimeSeconds,
      );

      if (messages.length === 0) {
        this.logger.info({ msg: "No messages available." });
        return;
      }

      for (const message of messages) {
        if (!message.Body) continue;

        const event = JSON.parse(message.Body);
        const record = event.Records?.[0];
        if (!record) continue;

        const bucket = record.s3.bucket.name;
        const fileKey = record.s3.object.key;

        this.logger.info({ msg: `Processing file: ${fileKey}` });
        await this.processFile(bucket, fileKey);
        await this.queueService.delete(message.ReceiptHandle!);
      }
    } catch (error) {
      this.logger.error({ msg: "Error processing SQS message", error });
    }
  }

  private async processFile(bucket: string, fileKey: string): Promise<void> {
    try {
      const filePath = await this.fileService.downloadFile(bucket, fileKey);

      this.logger.info({ msg: `Downloaded file to ${filePath}` });

      await ExpenseParser.processCsv(filePath, async (expenseData) => {
        try {
          const { value, error } =
            this.validatorService.validate<IExpenseBatchProcessorData>(
              ExpenseBatchProcessorSchema.createExpenseBatch,
              {
                ...expenseData,
              },
            );

          if (error) {
            throw new BadRequestError(
              "Missing or invalid parameters",
              expenseBatchProcessorCodes.MISSING_OR_INVALID_PARAMETERS,
              this.validatorService.formatErrorMessage(error),
            );
          }
          await this.expenseService.create(value);
        } catch (error) {
          if (error instanceof HttpError) {
            this.logger.error({
              msg: "Error processing row",
              code: error.code,
              description: error.description,
              ...(error.validationErrors &&
                error.validationErrors.length && {
                  validationErrors: error.validationErrors,
                }),
            });
            return;
          }
          const internalServerError = new InternalServerError();
          this.logger.error({
            msg: "Error processing row",
            code: internalServerError.code,
            description: internalServerError.description,
            error,
          });
        }
      });

      this.logger.info({ msg: `Finished processing file: ${fileKey}` });
      await this.fileService.deleteFile(bucket, fileKey);
    } catch (error) {
      await this.fileService.deleteFile(bucket, fileKey);
      this.logger.error({ msg: "Error processing file", error });
    }
  }
}
