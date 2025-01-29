import { PrismaClient } from "@prisma/client";
import { IDatabaseClient } from "@/infra/interfaces";
import { IGroup, IGroupRepository } from "./interfaces";

export class GroupRepository implements IGroupRepository {
  private prisma: PrismaClient;

  constructor(private databaseClient: IDatabaseClient) {
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
}
