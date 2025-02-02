import { IGroup } from ".";

export interface IGroupService {
  create(name: string): Promise<IGroup>;
  addMember(groupId: number, memberId: number): Promise<void>;
  getByName(name: string): Promise<IGroup | null>;
  getById(id: number): Promise<IGroup | null>;
}
