import { DatabaseClient } from "@/infra/database";
import { MemberService, MemberRepository } from ".";

export class MemberServiceFactory {
  private static instance: MemberService;

  static getInstance(): MemberService {
    if (!this.instance) {
      this.instance = new MemberService(
        new MemberRepository(DatabaseClient.getInstance()),
      );
    }
    return this.instance;
  }
}
