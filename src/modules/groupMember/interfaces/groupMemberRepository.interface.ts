import { IGroupMember, IGroupWithMember } from ".";

export interface IGroupMemberRepository {
  create(groupId: number, memberId: number): Promise<IGroupMember>;
  findByGroupAndMember(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember | null>;
  findMembersByGroupId(groupId: number): Promise<IGroupMember[]>;
  findMembersWithDetailsByGroupId(groupId: number): Promise<IGroupWithMember[]>;
}
