import { Prisma } from "@prisma/client";
import { IBalanceCreate, IBalanceUpdate, ITransfer } from ".";

export interface IBalanceService {
  get(memberId: number, groupId: number): Promise<number>;
  update(
    data: IBalanceUpdate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;
  transfer(
    data: ITransfer,
    transaction: Prisma.TransactionClient,
  ): Promise<void>;
  getAllBalancesByGroup(groupId: number): void;
  create(
    data: IBalanceCreate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;
}
