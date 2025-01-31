export interface IBalanceUpdate {
  memberId: number;
  groupId: number;
  balance: number;
}

export interface ITransfer {
  amount: number;
  senderId: number;
  receiverId: number;
  groupId: number;
}
