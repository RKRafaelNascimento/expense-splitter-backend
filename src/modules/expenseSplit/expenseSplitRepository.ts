import { Prisma, PrismaClient } from "@prisma/client";
import { IDatabaseClient } from "@/infra/interfaces";
import {
  IExpenseSplit,
  IExpenseSplitData,
  IExpenseSplitRepository,
} from "./interfaces";

export class ExpenseSplitRepository implements IExpenseSplitRepository {
  private prisma: PrismaClient;

  constructor(private databaseClient: IDatabaseClient) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async create(
    data: IExpenseSplitData,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit> {
    const prismaClient = transaction || this.prisma;

    return prismaClient.expenseSplit.create({
      data,
    });
  }

  async getByExpenseId(expenseId: number): Promise<IExpenseSplit[]> {
    return this.prisma.expenseSplit.findMany({
      where: { expenseId },
    });
  }

  async markAsPaid(
    expenseSplitId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<IExpenseSplit> {
    const prismaClient = transaction || this.prisma;

    return prismaClient.expenseSplit.update({
      where: { id: expenseSplitId },
      data: { paid: true },
    });
  }
}
