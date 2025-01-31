import { PaymentService } from ".";
import { ExpenseSplitServiceFactory } from "@/modules/expenseSplit";
import { DatabaseClient } from "@/infra/database";
import { ExpenseServiceFactory } from "../expense/expenseFactory";
import { BalanceServiceFactory } from "../balance/balanceFactory";

export class PaymentServiceFactory {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!this.instance) {
      this.instance = new PaymentService(
        ExpenseServiceFactory.getInstance(),
        ExpenseSplitServiceFactory.getInstance(),
        BalanceServiceFactory.getInstance(),
        DatabaseClient.getInstance(),
      );
    }
    return this.instance;
  }
}
