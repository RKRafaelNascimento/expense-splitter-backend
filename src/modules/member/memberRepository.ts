import { PrismaClient } from "@prisma/client";
import { IDatabaseClient } from "@/infra/interfaces";
import { IMemberRepository, IMember } from "./interfaces";

export class MemberRepository implements IMemberRepository {
  private prisma: PrismaClient;

  constructor(private databaseClient: IDatabaseClient) {
    this.prisma = this.databaseClient.getOrmClient();
  }

  async create(name: string, email: string): Promise<IMember> {
    return this.prisma.member.create({
      data: { name, email },
    });
  }

  async getByEmail(email: string): Promise<IMember | null> {
    return this.prisma.member.findUnique({
      where: { email },
    });
  }

  async getById(id: number): Promise<IMember | null> {
    return this.prisma.member.findUnique({
      where: { id },
    });
  }
}
