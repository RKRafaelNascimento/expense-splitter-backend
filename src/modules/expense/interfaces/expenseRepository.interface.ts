import { Prisma } from "@prisma/client";
import { IExpense, IExpenseCreate, IExpenseWithSplit } from ".";

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
  findPendingExpensesAndSplitsOwedToMember(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]>;
  findUnpaidExpensesAndSplitsYouOwe(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]>;
}
