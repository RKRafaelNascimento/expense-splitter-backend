import { ExpenseRepository } from ".";
import { IExpenseService } from "./interfaces";
import { IExpense } from "./interfaces";
import { ExpenseSplitService } from "@/modules/expenseSplit";
import {
  GroupMemberService,
  GroupMemberServiceFactory,
} from "@/modules/groupMember";
import { IMemberSplit, IExpenseData } from "./interfaces";
import { BadRequestError } from "@/shared/errors";
import { expenseErrorCodes } from "./errors";
import { PrismaClient } from "@prisma/client";

export class ExpenseService implements IExpenseService {
  private prisma = new PrismaClient();
  constructor(
    private expenseRepository: ExpenseRepository,
    private expenseSplitService: ExpenseSplitService,
    private groupMemberService: GroupMemberService = GroupMemberServiceFactory.getInstance(),
  ) {}

  async create(data: IExpenseData): Promise<IExpense> {
    return await this.prisma.$transaction(async (transaction) => {
      const { groupId, amount, name, memberId, memberIds } = data;

      if (memberIds && memberIds.length) {
        await this.validateMembersInGroup(groupId, memberIds);
      }

      const memberIdsMapped =
        memberIds && memberIds.length
          ? memberIds
          : (await this.groupMemberService.findMembersByGroupId(groupId)).map(
              (member) => member.memberId,
            );

      const memberSplit = this.splitAmountAmongMembers(memberIdsMapped, amount);

      const expense = await this.expenseRepository.create(
        {
          name,
          createdBy: memberId,
          amount,
          groupId,
        },
        transaction,
      );

      for (const { memberId, splitAmount } of memberSplit) {
        await this.expenseSplitService.create(
          {
            expenseId: expense.id,
            memberId,
            splitAmount,
          },
          transaction,
        );
      }

      return expense;
    });
  }

  private splitAmountAmongMembers(
    memberIds: number[],
    totalAmount: number,
  ): IMemberSplit[] {
    const numberOfMembers = memberIds.length;

    const totalAmountInCents = totalAmount * 100;

    const baseAmountInCents = Math.floor(totalAmountInCents / numberOfMembers);

    const membersWithExtraCent = totalAmountInCents % numberOfMembers;

    return memberIds.map((memberId, index) => {
      const amountSplitInCents =
        baseAmountInCents + (index < membersWithExtraCent ? 1 : 0);
      return {
        memberId,
        splitAmount: Number((amountSplitInCents / 100).toFixed(2)),
      };
    });
  }

  private async validateMembersInGroup(groupId: number, memberIds: number[]) {
    for (const memberId of memberIds) {
      const member = await this.groupMemberService.findByGroupAndMember(
        groupId,
        memberId,
      );
      if (!member) {
        throw new BadRequestError(
          `Member with ID ${memberId} not found in group ${groupId}`,
          expenseErrorCodes.MEMBER_NOT_FOUND_IN_GROUP,
        );
      }
    }
  }
}
