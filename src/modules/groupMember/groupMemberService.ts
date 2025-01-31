import { groupMemberErrorCodes } from "./erros";
import {
  IGroupMemberService,
  IGroupMemberRepository,
  IGroupMember,
} from "./interfaces";
import { BadRequestError } from "@/shared/errors";

export class GroupMemberService implements IGroupMemberService {
  constructor(private groupMemberRepository: IGroupMemberRepository) {}

  async addMemberToGroup(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember> {
    const alreadyExists = await this.groupMemberRepository.findByGroupAndMember(
      groupId,
      memberId,
    );

    if (alreadyExists) {
      throw new BadRequestError(
        "Member is already in the group",
        groupMemberErrorCodes.MEMBER_IS_ALREADY_GROUP,
      );
    }

    return this.groupMemberRepository.create(groupId, memberId);
  }

  async findByGroupAndMember(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember | null> {
    return this.groupMemberRepository.findByGroupAndMember(groupId, memberId);
  }

  async findMembersByGroupId(groupId: number): Promise<IGroupMember[]> {
    return this.groupMemberRepository.findMembersByGroupId(groupId);
  }
}
