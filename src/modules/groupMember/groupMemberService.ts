import { GroupRepository } from "@/modules/group";
import { IGroupRepository } from "@/modules/group/interfaces";
import { MemberServiceFactory } from "@/modules/member";
import { IMemberService } from "@/modules/member/interfaces";
import { groupMemberErrorCodes } from "./erros";
import {
  IGroupMemberService,
  IGroupMemberRepository,
  IGroupMember,
  IGroupWithMember,
} from "./interfaces";
import { BadRequestError, NotFoundError } from "@/shared/errors";

export class GroupMemberService implements IGroupMemberService {
  constructor(
    private groupMemberRepository: IGroupMemberRepository,
    private memberService: IMemberService = MemberServiceFactory.getInstance(),
    private groupRepository: IGroupRepository = new GroupRepository(),
  ) {}

  async addMemberToGroup(
    groupId: number,
    memberId: number,
  ): Promise<IGroupMember> {
    const alreadyExists = await this.groupMemberRepository.findByGroupAndMember(
      groupId,
      memberId,
    );

    const member = await this.memberService.getById(memberId);

    if (!member) {
      throw new NotFoundError(
        "Member does not exist",
        groupMemberErrorCodes.MEMBER_DOES_NOT_EXIST,
      );
    }

    const group = await this.groupRepository.getById(groupId);

    if (!group) {
      throw new NotFoundError(
        "Group does not exist",
        groupMemberErrorCodes.GROUP_DOES_NOT_EXIST,
      );
    }

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

  async findMembersWithDetailsByGroupId(
    groupId: number,
  ): Promise<IGroupWithMember[]> {
    return this.groupMemberRepository.findMembersWithDetailsByGroupId(groupId);
  }
}
