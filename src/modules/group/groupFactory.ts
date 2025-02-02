import { GroupService, GroupRepository } from ".";

import { DatabaseClient } from "@/infra/database";
import { GroupMemberServiceFactory } from "@/modules/groupMember";

export class GroupServiceFactory {
  private static instance: GroupService;

  static getInstance(): GroupService {
    if (!this.instance) {
      this.instance = new GroupService(
        new GroupRepository(DatabaseClient.getInstance()),
        GroupMemberServiceFactory.getInstance(),
      );
    }
    return this.instance;
  }
}
