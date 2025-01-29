import { Request, Response } from "express";
import { IMember, IMemberService } from "./interfaces";
import { IValidatorService } from "@/shared/Validator/interfaces";
import { MemberSchema } from "./schemas";
import { BadRequestError } from "@/shared/errors";
import { ErrorCodes } from "@/shared/enums";
import { HttpHelpers } from "@/shared/HttpHelper";
import StatusCode from "http-status-codes";
import { IMemberController } from "./interfaces";

export class MemberController implements IMemberController {
  constructor(
    private memberService: IMemberService,
    private validatorService: IValidatorService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { value, error } = this.validatorService.validate<
        Omit<IMember, "id" | "createdAt">
      >(MemberSchema.createMember, req.body);

      if (error)
        throw new BadRequestError(
          "Missing Params or Invalid",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
          this.validatorService.formatErrorMessage(error),
        );

      const { name, email } = value;

      const member = await this.memberService.create(name, email);

      res.status(StatusCode.CREATED).json(HttpHelpers.sucessResponse(member));
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(HttpHelpers.handleError(error));
    }
  }
}
