import { Prisma } from "@prisma/client";
import { IExpense, IExpenseData } from ".";

export interface IExpenseService {
  create(data: IExpenseData, memberIds: number[]): Promise<IExpense>;
  findByIdAndGroup(
    expenseId: number,
    groupId: number,
  ): Promise<IExpense | null>;
  markAsPaid(
    expenseId: number,
    groupId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense | undefined>;
}
