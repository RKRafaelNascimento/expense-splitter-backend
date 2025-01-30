import { PrismaClient } from "@prisma/client";
import { IDatabaseClient } from "@/infra/interfaces";
import { IGroupMember, IGroupMemberRepository } from "./interfaces";

export class GroupMemberRepository implements IGroupMemberRepository {
  private prisma: PrismaClient;

  constructor(private databaseClient: IDatabaseClient) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async create(groupId: number, memberId: number): Promise<IGroupMember> {
    return this.prisma.groupMember.create({
      data: { groupId, memberId },
    });
  }

  async findByGroupAndMember(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember | null> {
    return this.prisma.groupMember.findUnique({
      where: { groupId_memberId: { groupId, memberId } },
    });
  }
}
