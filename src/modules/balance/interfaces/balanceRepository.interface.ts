import { Prisma } from "@prisma/client";
import { IBalanceCreate, IBalanceUpdate } from "./balance.interface";

export interface IBalanceRepository {
  get(memberId: number, groupId: number): Promise<number>;
  update(
    data: IBalanceUpdate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;
  create(
    data: IBalanceCreate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;
}
