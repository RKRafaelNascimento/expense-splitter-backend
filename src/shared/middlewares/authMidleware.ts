import { IGroupMemberService } from "@/modules/groupMember/interfaces";
import { GroupMemberServiceFactory } from "@/modules/groupMember";
import { UnauthorizedError, BadRequestError } from "../errors";
import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../enums";
import { HttpHelpers } from "../HttpHelper";

export class GroupMemberMiddleware {
  private static groupMemberService: IGroupMemberService =
    GroupMemberServiceFactory.getInstance();

  public static async check(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const groupId = Number(req.headers["group_id"]);
      const memberId = Number(req.headers["member_id"]);

      if (!groupId || !memberId) {
        throw new BadRequestError(
          "Group ID or Member ID is missing or invalid",
          ErrorCodes.MISSING_OR_INVALID_PARAMETERS,
        );
      }

      const isMember =
        await GroupMemberMiddleware.groupMemberService.findByGroupAndMember(
          groupId,
          memberId,
        );

      if (!isMember) {
        throw new UnauthorizedError(
          "User is not a member of the specified group",
          ErrorCodes.USER_NOT_IN_GROUP,
        );
      }

      // @ts-expect-error ignore
      req.groupId = groupId;
      // @ts-expect-error ignore
      req.memberId = memberId;

      next();
    } catch (error) {
      const response = HttpHelpers.handleError(error);
      res.status(response.statusCode).json(response);
    }
  }
}
