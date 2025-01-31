import { Router } from "express";
import { BalanceControllerFactory } from ".";

const routes = Router();

const balanceController = BalanceControllerFactory.getInstance();

routes.get(
  "/balance/:groupId",
  balanceController.getBalances.bind(balanceController),
);

export default routes;
