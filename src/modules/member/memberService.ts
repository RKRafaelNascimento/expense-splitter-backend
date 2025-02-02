import { ErrorCodes } from "@/shared/enums";
import { IMemberService, IMemberRepository, IMember } from "./interfaces";
import { BadRequestError } from "@/shared/errors";

export class MemberService implements IMemberService {
  constructor(private memberRepository: IMemberRepository) {}

  async create(name: string, email: string): Promise<IMember> {
    const existingMember = await this.memberRepository.getByEmail(email);

    if (existingMember)
      throw new BadRequestError(
        `A member with the email ${email} already exists`,
        ErrorCodes.EMAIL_ALREADY_EXISTS,
      );

    return this.memberRepository.create(name, email);
  }

  async getByEmail(email: string): Promise<IMember | null> {
    return this.memberRepository.getByEmail(email);
  }

  async getById(id: number): Promise<IMember | null> {
    return this.memberRepository.getById(id);
  }
}
