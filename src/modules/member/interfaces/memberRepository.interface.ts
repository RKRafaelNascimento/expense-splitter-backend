import { IMember } from ".";

export interface IMemberRepository {
  create(name: string, email: string): Promise<IMember>;
  getByEmail(email: string): Promise<IMember | null>;
}
