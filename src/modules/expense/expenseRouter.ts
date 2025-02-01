import { Router } from "express";
import { ExpenseControllerFactory } from ".";
import { GroupMemberMiddleware } from "@/shared/middlewares";
import { upload } from "@/shared/Multer";

const expenseController = ExpenseControllerFactory.getInstance();

const routes = Router();

routes.post(
  "/expense",
  GroupMemberMiddleware.check,
  expenseController.create.bind(expenseController),
);

routes.post(
  "/expense/upload",
  upload.single("file"),
  expenseController.uploadCsv.bind(expenseController),
);

export default routes;
