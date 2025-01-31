import { Prisma } from "@prisma/client";
import { IExpense, IExpenseCreate } from ".";

export interface IExpenseRepository {
  create(
    data: IExpenseCreate,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense>;
  findByIdAndGroup(
    expenseId: number,
    groupId: number,
  ): Promise<IExpense | null>;
  markAsPaid(
    expenseId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense>;
}
