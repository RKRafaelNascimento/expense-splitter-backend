import { Router } from "express";
import { PaymentServiceFactory, PaymentController } from ".";
import { GroupMemberMiddleware } from "@/shared/middlewares";
import { ValidatorService } from "@/shared/Validator";

const router = Router();
const paymentController = new PaymentController(
  PaymentServiceFactory.getInstance(),
  new ValidatorService(),
);

router.post(
  "/payment",
  GroupMemberMiddleware.check,
  paymentController.payExpense.bind(paymentController),
);

export default router;
