import { Prisma } from "@prisma/client";
import { IExpenseSplit, IExpenseSplitData } from ".";

export interface IExpenseSplitService {
  create(
    data: IExpenseSplitData,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit>;

  getSplitsByExpense(expenseId: number): Promise<IExpenseSplit[]>;

  markAsPaid(
    expenseSplitId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit>;
}
