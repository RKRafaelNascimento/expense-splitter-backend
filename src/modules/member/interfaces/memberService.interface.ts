import { IMember } from ".";

export interface IMemberService {
  create(name: string, email: string): Promise<IMember>;
  getByEmail(email: string): Promise<IMember | null>;
  getById(id: number): Promise<IMember | null>;
}
