import { BadRequestError } from "@/shared/errors";
import { IGroupService, IGroupRepository, IGroup } from "./interfaces";
import { ErrorCodes } from "@/shared/enums";
import { IGroupMemberService } from "@/modules/groupMember/interfaces";

export class GroupService implements IGroupService {
  constructor(
    private groupRepository: IGroupRepository,
    private groupMemberService: IGroupMemberService,
  ) {}

  async create(name: string): Promise<IGroup> {
    const group = await this.groupRepository.getByName(name);

    if (group)
      throw new BadRequestError(
        `A group with the name ${name} already exists`,
        ErrorCodes.GROUP_ALREADY_EXISTS,
      );

    return this.groupRepository.create(name);
  }

  async addMember(groupId: number, memberId: number): Promise<void> {
    await this.groupMemberService.addMemberToGroup(groupId, memberId);
  }

  async getByName(name: string): Promise<IGroup | null> {
    return this.groupRepository.getByName(name);
  }

  async getById(id: number): Promise<IGroup | null> {
    return this.groupRepository.getById(id);
  }
}
