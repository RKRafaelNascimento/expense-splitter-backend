export interface IExpenseCreate {
  groupId: number;
  name: string;
  amount: number;
  createdBy: number;
}

export interface IExpenseData {
  name: string;
  amount: number;
  groupId: number;
  memberId: number;
  memberIds?: number[];
}

export interface IExpense {
  id: number;
  groupId: number;
  name: string;
  amount: number;
  paid: boolean;
  paymentDate?: Date | null;
  createdBy: number;
  createdAt: Date;
}

export interface IMemberSplit {
  memberId: number;
  splitAmount: number;
}
