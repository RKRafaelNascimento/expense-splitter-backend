import { Request, Response } from "express";

export interface IMemberController {
  create(req: Request, res: Response): Promise<void>;
}
