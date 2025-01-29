import { BadRequestError } from "@/shared/errors";
import { IGroupService, IGroupRepository, IGroup } from "./interfaces";

export class GroupService implements IGroupService {
  constructor(private groupRepository: IGroupRepository) {}

  async create(name: string): Promise<IGroup> {
    const group = await this.groupRepository.getByName(name);

    if (group)
      throw new BadRequestError(`A group with the name ${name} already exists`);

    return this.groupRepository.create(name);
  }
}
