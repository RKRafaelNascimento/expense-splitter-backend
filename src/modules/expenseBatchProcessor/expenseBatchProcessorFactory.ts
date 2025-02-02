import { FileService } from "@/shared/FileService";
import { ExpenseBatchProcessor } from "./expenseBatchProcessor";
import { QueueService } from "@/shared/QueueService";
import { ExpenseServiceFactory } from "@/modules/expense";
import { awsConfig, awsQueueExpenseBatch } from "@/config";
import { ValidatorService } from "@/shared/Validator";

export class ExpenseBatchProcessorFactory {
  private static instance: ExpenseBatchProcessor;

  static getInstance(): ExpenseBatchProcessor {
    if (!this.instance) {
      this.instance = new ExpenseBatchProcessor(
        new FileService(),
        new QueueService(awsConfig(), awsQueueExpenseBatch),
        ExpenseServiceFactory.getInstance(),
        new ValidatorService(),
      );
    }
    return this.instance;
  }
}
