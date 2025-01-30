import { GroupMemberService, GroupMemberRepository } from ".";
import { DatabaseClient } from "@/infra/database";

export class GroupMemberServiceFactory {
  private static instance: GroupMemberService;

  static getInstance(): GroupMemberService {
    if (!this.instance) {
      this.instance = new GroupMemberService(
        new GroupMemberRepository(DatabaseClient.getInstance()),
      );
    }
    return this.instance;
  }
}
