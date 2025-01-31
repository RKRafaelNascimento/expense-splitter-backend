import { Prisma } from "@prisma/client";
import {
  IBalanceService,
  IBalanceRepository,
  IBalanceUpdate,
} from "./interfaces";
import { ITransfer } from "./interfaces/balance.interface";
import { NotFoundError } from "@/shared/errors";
import { balanceErrorCodes } from "./error";

export class BalanceService implements IBalanceService {
  constructor(private balanceRepository: IBalanceRepository) {}

  async get(memberId: number, groupId: number): Promise<number> {
    return this.balanceRepository.get(memberId, groupId);
  }

  async update(
    data: IBalanceUpdate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return this.balanceRepository.update(data, transaction);
  }

  async transfer(
    data: ITransfer,
    transaction: Prisma.TransactionClient,
  ): Promise<void> {
    const { senderId, receiverId, amount, groupId } = data;
    const senderBalance = await this.get(senderId, groupId);

    if (senderBalance < amount) {
      throw new NotFoundError(
        "Insufficient balance to make the transfer.",
        balanceErrorCodes.INSUFFICIENT_BALANCE,
      );
    }

    await this.update(
      { memberId: senderId, groupId, balance: senderBalance - amount },
      transaction,
    );

    const receiverBalance = await this.get(receiverId, groupId);

    await this.update(
      { memberId: receiverId, groupId, balance: receiverBalance + amount },
      transaction,
    );
  }
}
