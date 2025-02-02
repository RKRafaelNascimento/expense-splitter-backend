import { Prisma } from "@prisma/client";
import {
  IBalanceService,
  IBalanceRepository,
  IBalanceUpdate,
} from "./interfaces";
import { IBalance, ITransfer } from "./interfaces";
import { BadRequestError } from "@/shared/errors";
import { balanceErrorCodes } from "./error";
import { IGroupMemberService } from "@/modules/groupMember/interfaces";
import { GroupMemberServiceFactory } from "@/modules/groupMember";
import { IExpenseService } from "@/modules/expense/interfaces";
import { ExpenseServiceFactory } from "@/modules/expense";

export class BalanceService implements IBalanceService {
  constructor(
    private balanceRepository: IBalanceRepository,
    private groupMemberService: IGroupMemberService = GroupMemberServiceFactory.getInstance(),
    private expenseService: IExpenseService = ExpenseServiceFactory.getInstance(),
  ) {}

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
      throw new BadRequestError(
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

  async getAllBalancesByGroup(groupId: number): Promise<IBalance[]> {
    const members =
      await this.groupMemberService.findMembersWithDetailsByGroupId(groupId);

    const balances = await Promise.all(
      members.map(async (member) => {
        const currentBalance = await this.get(member.memberId, groupId);

        const totalOwedToMember =
          await this.expenseService.findPendingExpensesAndSplitsOwedToMember(
            groupId,
            member.memberId,
          );

        const totalOwedAmount = totalOwedToMember.reduce(
          (sum, expense) =>
            sum +
            expense.expenseSplits.reduce(
              (subSum, split) => subSum + split.splitAmount,
              0,
            ),
          0,
        );

        const totalYouOwe =
          await this.expenseService.findUnpaidExpensesAndSplitsYouOwe(
            groupId,
            member.memberId,
          );

        const totalYouOweAmount = totalYouOwe.reduce(
          (sum, expense) =>
            sum +
            expense.expenseSplits.reduce(
              (subSum, split) => subSum + split.splitAmount,
              0,
            ),
          0,
        );
        const netBalance = currentBalance + totalYouOweAmount - totalOwedAmount;

        return {
          name: member.member.name,
          email: member.member.email,
          netBalance: parseFloat(netBalance.toFixed(2)),
          currentBalance: parseFloat(currentBalance.toFixed(2)),
          totalYouOweAmount: parseFloat(totalYouOweAmount.toFixed(2)),
          totalOwedAmount: parseFloat(totalOwedAmount.toFixed(2)),
        };
      }),
    );

    return balances;
  }
}
