import { NotFoundError, BadRequestError } from "@/shared/errors";
import { IDatabaseClient } from "@/infra/interfaces";
import { IExpenseService } from "@/modules/expense/interfaces";
import { IExpenseSplitService } from "@/modules/expenseSplit/interfaces";
import { IBalanceService } from "@/modules/balance/interfaces";
import { IPaymentData } from "./interfaces";
import { paymentErrorCodes } from "./errors";

export class PaymentService {
  constructor(
    private expenseService: IExpenseService,
    private expenseSplitService: IExpenseSplitService,
    private balanceService: IBalanceService,
    private databaseClient: IDatabaseClient,
  ) {}

  async payExpense(data: IPaymentData): Promise<void> {
    const prismaTransaction = this.databaseClient.getOrmClient();

    await prismaTransaction.$transaction(async (transaction) => {
      const { groupId, expenseId, memberId } = data;
      const expense = await this.expenseService.findByIdAndGroup(
        expenseId,
        groupId,
      );

      if (!expense) {
        throw new NotFoundError(
          "Expense not found or does not belong to the group.",
          paymentErrorCodes.EXPENSE_NOT_FOUND,
        );
      }

      if (expense.paid) {
        throw new BadRequestError(
          "The expense has already been paid.",
          paymentErrorCodes.EXPENSE_ALREADY_PAID,
        );
      }

      const expenseSplit =
        await this.expenseSplitService.getSplitsByExpense(expenseId);

      const myExpenseSplit = expenseSplit.find(
        (expense) => expense.memberId === memberId,
      );

      if (!myExpenseSplit) {
        throw new NotFoundError(
          "No split found for this member.",
          paymentErrorCodes.NO_SPLIT_FOUND,
        );
      }

      if (myExpenseSplit.paid) {
        throw new BadRequestError(
          "This expense is already paid.",
          paymentErrorCodes.EXPENSE_SPLIT_ALREADY_PAID,
        );
      }

      await this.balanceService.transfer(
        {
          senderId: memberId,
          receiverId: expense.createdBy,
          amount: myExpenseSplit.splitAmount,
          groupId: groupId,
        },
        transaction,
      );

      await this.expenseSplitService.markAsPaid(myExpenseSplit.id, transaction);
      await this.expenseService.markAsPaid(expense.id, groupId, transaction);
    });
  }
}
