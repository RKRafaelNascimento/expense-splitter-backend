import { Prisma } from "@prisma/client";
import {
  IExpenseSplitService,
  IExpenseSplitRepository,
  IExpenseSplit,
  IExpenseSplitData,
} from "./interfaces";

export class ExpenseSplitService implements IExpenseSplitService {
  constructor(private expenseSplitRepository: IExpenseSplitRepository) {}

  async create(
    data: IExpenseSplitData,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit> {
    return this.expenseSplitRepository.create(data, transaction);
  }

  async getSplitsByExpense(
    expenseId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit[]> {
    return this.expenseSplitRepository.getByExpenseId(expenseId, transaction);
  }

  async markAsPaid(
    expenseSplitId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit> {
    return this.expenseSplitRepository.markAsPaid(expenseSplitId, transaction);
  }
}
