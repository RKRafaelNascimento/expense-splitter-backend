import { BadRequestError } from "@/shared/errors";
import { IGroupService, IGroupRepository, IGroup } from "./interfaces";
import { ErrorCodes } from "@/shared/enums";

export class GroupService implements IGroupService {
  constructor(private groupRepository: IGroupRepository) {}

  async create(name: string): Promise<IGroup> {
    const group = await this.groupRepository.getByName(name);

    if (group)
      throw new BadRequestError(
        `A group with the name ${name} already exists`,
        ErrorCodes.GROUP_ALREADY_EXISTS,
      );

    return this.groupRepository.create(name);
  }
}
