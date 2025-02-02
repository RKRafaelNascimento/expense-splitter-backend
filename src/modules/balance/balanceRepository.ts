import { Prisma, PrismaClient } from "@prisma/client";
import {
  IBalanceUpdate,
  IBalanceRepository,
  IBalanceCreate,
} from "./interfaces";
import { IDatabaseClient } from "@/infra/interfaces";
import { DatabaseClient } from "@/infra/database";

export class BalanceRepository implements IBalanceRepository {
  private prisma: PrismaClient;

  constructor(
    private databaseClient: IDatabaseClient = DatabaseClient.getInstance(),
  ) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async get(memberId: number, groupId: number): Promise<number> {
    const balance = await this.prisma.balance.findUnique({
      where: { memberId_groupId: { memberId, groupId } },
      select: { balance: true },
    });

    return balance?.balance ?? 0;
  }

  async update(
    { balance, memberId, groupId }: IBalanceUpdate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaClient = transaction || this.prisma;
    await prismaClient.balance.update({
      where: { memberId_groupId: { memberId, groupId } },
      data: { balance },
    });
  }

  async create(
    { balance, memberId, groupId }: IBalanceCreate,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaClient = transaction || this.prisma;
    await prismaClient.balance.create({
      data: {
        memberId,
        groupId,
        balance,
      },
    });
  }
}
