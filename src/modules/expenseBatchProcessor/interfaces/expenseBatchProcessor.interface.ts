export interface IExpenseBatchProcessorData {
  name: string;
  amount: number;
  groupId: number;
  memberId: number;
  memberIds?: number[];
}
