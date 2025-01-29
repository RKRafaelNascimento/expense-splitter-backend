import { IMember } from ".";

export interface IMemberService {
  create(name: string, email: string): Promise<IMember>;
}
