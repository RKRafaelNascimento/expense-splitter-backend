import { Prisma } from "@prisma/client";
import { IExpense, IExpenseData, IExpenseWithSplit } from ".";

export interface IExpenseService {
  create(data: IExpenseData): Promise<IExpense>;
  findByIdAndGroup(
    expenseId: number,
    groupId: number,
  ): Promise<IExpense | null>;
  markAsPaid(
    expenseId: number,
    groupId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense | undefined>;
  findPendingExpensesAndSplitsOwedToMember(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]>;
  findUnpaidExpensesAndSplitsYouOwe(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]>;
}
