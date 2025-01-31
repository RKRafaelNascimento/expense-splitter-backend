import { IExpense, IExpenseData } from ".";

export interface IExpenseService {
  create(data: IExpenseData, memberIds: number[]): Promise<IExpense>;
  findByIdAndGroup(
    expenseId: number,
    groupId: number,
  ): Promise<IExpense | null>;
}
