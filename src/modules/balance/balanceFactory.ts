import { BalanceRepository, BalanceService } from ".";
import { DatabaseClient } from "@/infra/database";

export class BalanceServiceFactory {
  private static instance: BalanceService;

  static getInstance(): BalanceService {
    if (!this.instance) {
      this.instance = new BalanceService(
        new BalanceRepository(DatabaseClient.getInstance()),
      );
    }
    return this.instance;
  }
}
