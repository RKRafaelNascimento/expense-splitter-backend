import { Request, Response } from "express";

export interface IBalanceController {
  getBalances(req: Request, res: Response): Promise<void>;
}
