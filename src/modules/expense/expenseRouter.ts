import { Router } from "express";
import { ExpenseControllerFactory } from ".";
import { GroupMemberMiddleware } from "@/shared/middlewares";
import { upload, validateUploadedFile } from "@/shared/Multer";

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
  // @ts-expect-error ignore
  validateUploadedFile,
  expenseController.uploadCsv.bind(expenseController),
);

export default routes;
