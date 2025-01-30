import { IGroupMember } from ".";

export interface IGroupMemberRepository {
  create(groupId: number, memberId: number): Promise<IGroupMember>;
  findByGroupAndMember(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember | null>;
}
