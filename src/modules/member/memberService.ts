import { IMemberService, IMemberRepository } from "./interfaces";
import { Member } from "@prisma/client";
import { BadRequestError } from "@/shared/errors";
import { ErrorCodes } from "@/shared/enums";

export class MemberService implements IMemberService {
  constructor(private memberRepository: IMemberRepository) {}

  async create(name: string, email: string): Promise<Member> {
    const existingMember = await this.memberRepository.getByEmail(email);

    if (existingMember)
      throw new BadRequestError(
        `A member with the email ${email} already exists`,
        ErrorCodes.EMAIL_ALREADY_EXISTS,
      );

    return this.memberRepository.create(name, email);
  }
}
