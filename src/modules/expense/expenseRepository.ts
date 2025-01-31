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
}
