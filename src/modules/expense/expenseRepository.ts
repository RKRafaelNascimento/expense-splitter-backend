import { Prisma, PrismaClient } from "@prisma/client";
import { IExpenseRepository, IExpenseWithSplit } from "./interfaces";
import { IExpenseCreate, IExpense } from "./interfaces";
import { IDatabaseClient } from "@/infra/interfaces";

export class ExpenseRepository implements IExpenseRepository {
  private prisma: PrismaClient;

  constructor(private databaseClient: IDatabaseClient) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async create(
    data: IExpenseCreate,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense> {
    const prismaClient = transaction || this.prisma;

    return prismaClient.expense.create({
      data,
    });
  }

  async findByIdAndGroup(
    expenseId: number,
    groupId: number,
  ): Promise<IExpense | null> {
    return this.prisma.expense.findUnique({
      where: {
        id_groupId: {
          id: expenseId,
          groupId: groupId,
        },
      },
    });
  }

  async markAsPaid(
    expenseId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpense> {
    const prismaClient = transaction || this.prisma;

    return prismaClient.expense.update({
      where: { id: expenseId },
      data: {
        paid: true,
        paymentDate: new Date(),
      },
    });
  }

  async findPendingExpensesAndSplitsOwedToMember(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]> {
    return this.prisma.expense.findMany({
      where: {
        groupId: groupId,
        createdBy: memberId,
        paid: false,
      },
      include: {
        expenseSplits: {
          where: {
            paid: false,
          },
          select: {
            id: true,
            memberId: true,
            splitAmount: true,
            paid: true,
          },
        },
      },
    });
  }

  async findUnpaidExpensesAndSplitsYouOwe(
    groupId: number,
    memberId: number,
  ): Promise<IExpenseWithSplit[]> {
    return this.prisma.expense.findMany({
      where: {
        groupId: groupId,
        createdBy: {
          not: memberId,
        },
        paid: false,
      },
      include: {
        expenseSplits: {
          where: {
            paid: false,
            memberId: memberId,
          },
          select: {
            id: true,
            memberId: true,
            splitAmount: true,
            paid: true,
          },
        },
      },
    });
  }
}
