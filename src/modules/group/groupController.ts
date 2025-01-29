import { Request, Response } from "express";
import { IGroupService, IGroupController } from "./interfaces";
import { IValidatorService } from "@/shared/Validator/interfaces";
import { GroupSchema } from "./schemas";
import { BadRequestError } from "@/shared/errors";
import { ErrorCodes } from "@/shared/enums";
import { HttpHelpers } from "@/shared/HttpHelper";
import StatusCode from "http-status-codes";

export class GroupController implements IGroupController {
  constructor(
    private groupService: IGroupService,
    private validatorService: IValidatorService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { value, error } = this.validatorService.validate<{ name: string }>(
        GroupSchema.createGroup,
        req.body,
      );

      if (error)
        throw new BadRequestError(
          "Missing Params or Invalid",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
          this.validatorService.formatErrorMessage(error),
        );

      const { name } = value;

      const group = await this.groupService.create(name);

      res.status(StatusCode.OK).json(HttpHelpers.sucessResponse(group));
    } catch (error) {
      res.status(StatusCode.OK).json(HttpHelpers.handleError(error));
    }
  }
}
