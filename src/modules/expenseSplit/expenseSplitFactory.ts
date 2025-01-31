import { ExpenseSplitRepository, ExpenseSplitService } from ".";
import { DatabaseClient } from "@/infra/database";

export class ExpenseSplitServiceFactory {
  private static instance: ExpenseSplitService;

  static getInstance(): ExpenseSplitService {
    if (!this.instance) {
      const databaseClient = DatabaseClient.getInstance();
      const expenseSplitRepository = new ExpenseSplitRepository(databaseClient);
      this.instance = new ExpenseSplitService(expenseSplitRepository);
    }
    return this.instance;
  }
}
