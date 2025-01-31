import { Prisma, PrismaClient } from "@prisma/client";
import { IExpenseRepository } from "./interfaces";
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
}
