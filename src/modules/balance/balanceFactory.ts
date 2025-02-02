import { BalanceRepository, BalanceService, BalanceController } from ".";
import { DatabaseClient } from "@/infra/database";
import { IBalanceController } from "./interfaces";
import { ValidatorService } from "@/shared/Validator";
import { GroupMemberServiceFactory } from "@/modules/groupMember";
import { ExpenseServiceFactory } from "@/modules/expense";

export class BalanceServiceFactory {
  private static instance: BalanceService;

  static getInstance(): BalanceService {
    if (!this.instance) {
      this.instance = new BalanceService(
        new BalanceRepository(DatabaseClient.getInstance()),
        () => GroupMemberServiceFactory.getInstance(),
        () => ExpenseServiceFactory.getInstance(),
      );
    }
    return this.instance;
  }
}

export class BalanceControllerFactory {
  private static instance: IBalanceController;

  static getInstance(): IBalanceController {
    if (!this.instance) {
      const balanceService = BalanceServiceFactory.getInstance();
      this.instance = new BalanceController(
        balanceService,
        new ValidatorService(),
      );
    }
    return this.instance;
  }
}
