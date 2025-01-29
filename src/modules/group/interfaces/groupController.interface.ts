import { Request, Response } from "express";

export interface IGroupController {
  create(req: Request, res: Response): Promise<void>;
}
