import { Router } from "express";
import { ExpenseController, ExpenseService, ExpenseRepository } from ".";
import { ValidatorService } from "@/shared/Validator";
import { ExpenseSplitServiceFactory } from "@/modules/expenseSplit";
import { DatabaseClient } from "@/infra/database";
import { GroupMemberMiddleware } from "@/shared/middlewares";

const expenseRepository = new ExpenseRepository(DatabaseClient.getInstance());
const expenseSplitService = ExpenseSplitServiceFactory.getInstance();
const expenseService = new ExpenseService(
  expenseRepository,
  expenseSplitService,
);
const expenseController = new ExpenseController(
  expenseService,
  new ValidatorService(),
);

const routes = Router();

routes.post(
  "/expense",
  GroupMemberMiddleware.check,
  expenseController.create.bind(expenseController),
);

export default routes;
