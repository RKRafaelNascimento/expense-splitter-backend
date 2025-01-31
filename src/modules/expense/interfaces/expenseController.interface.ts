import { Request, Response } from "express";

export interface IExpenseController {
  create(req: Request, res: Response): Promise<void>;
}
