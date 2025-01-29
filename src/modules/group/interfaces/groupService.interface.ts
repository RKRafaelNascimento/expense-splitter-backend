import { IGroup } from ".";

export interface IGroupService {
  create(name: string): Promise<IGroup>;
}
