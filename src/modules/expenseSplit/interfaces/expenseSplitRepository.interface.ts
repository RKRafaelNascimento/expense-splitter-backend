import { Prisma } from "@prisma/client";
import { IExpenseSplit, IExpenseSplitData } from ".";

export interface IExpenseSplitRepository {
  create(
    data: IExpenseSplitData,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit>;

  getByExpenseId(
    expenseId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit[]>;

  markAsPaid(
    expenseSplitId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit>;
}
