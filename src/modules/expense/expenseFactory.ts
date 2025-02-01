import { ExpenseController, ExpenseService, ExpenseRepository } from ".";
import { ValidatorService } from "@/shared/Validator";
import { DatabaseClient } from "@/infra/database";
import { GroupMemberServiceFactory } from "@/modules/groupMember";
import { ExpenseSplitServiceFactory } from "@/modules/expenseSplit";
import { FileService } from "@/shared/FileService";

export class ExpenseServiceFactory {
  private static instance: ExpenseService;

  static getInstance(): ExpenseService {
    if (!this.instance) {
      const expenseRepository = new ExpenseRepository(
        DatabaseClient.getInstance(),
      );
      this.instance = new ExpenseService(
        expenseRepository,
        ExpenseSplitServiceFactory.getInstance(),
        GroupMemberServiceFactory.getInstance(),
      );
    }
    return this.instance;
  }
}

export class ExpenseControllerFactory {
  private static instance: ExpenseController;

  static getInstance(): ExpenseController {
    if (!this.instance) {
      this.instance = new ExpenseController(
        ExpenseServiceFactory.getInstance(),
        new ValidatorService(),
        new FileService(),
      );
    }
    return this.instance;
  }
}
