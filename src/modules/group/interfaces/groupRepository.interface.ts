import { IGroup } from ".";

export interface IGroupRepository {
  create(name: string): Promise<IGroup>;
  getByName(name: string): Promise<IGroup | null>;
}
