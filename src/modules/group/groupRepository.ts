import { PrismaClient } from "@prisma/client";
import { IDatabaseClient } from "@/infra/interfaces";
import { IGroup, IGroupRepository } from "./interfaces";
import { DatabaseClient } from "@/infra/database";

export class GroupRepository implements IGroupRepository {
  private prisma: PrismaClient;

  constructor(
    private databaseClient: IDatabaseClient = DatabaseClient.getInstance(),
  ) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async create(name: string): Promise<IGroup> {
    return this.prisma.group.create({
      data: { name },
    });
  }

  async getByName(name: string): Promise<IGroup | null> {
    return this.prisma.group.findUnique({
      where: { name },
    });
  }

  async getById(id: number): Promise<IGroup | null> {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }
}
