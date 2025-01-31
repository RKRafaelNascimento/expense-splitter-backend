export interface IExpenseSplitData {
  expenseId: number;
  memberId: number;
  splitAmount: number;
}

export interface IExpenseSplit {
  id: number;
  expenseId: number;
  memberId: number;
  splitAmount: number;
  paid: boolean;
  createdAt: Date;
}
