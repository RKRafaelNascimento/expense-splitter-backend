import { Router } from "express";
import { GroupController } from ".";
import { GroupServiceFactory } from "./groupFactory";
import { ValidatorService } from "@/shared/Validator";
import { IGroupController } from "./interfaces";

const groupFactory = (): IGroupController => {
  return new GroupController(
    GroupServiceFactory.getInstance(),
    new ValidatorService(),
  );
};

const groupController = groupFactory();

const routes = Router();

routes.post("/group", groupController.create.bind(groupController));
routes.post(
  "/group/add-member",
  groupController.addMember.bind(groupController),
);

export default routes;
