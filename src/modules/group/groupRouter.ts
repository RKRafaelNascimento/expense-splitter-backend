import { Router } from "express";
import { GroupController, GroupService, GroupRepository } from ".";
import { ValidatorService } from "@/shared/Validator";
import { DatabaseClient } from "@/infra/database";
import { IGroupController } from "./interfaces";

const groupFactory = (): IGroupController => {
  const databaseClient = DatabaseClient.getInstance();
  return new GroupController(
    new GroupService(new GroupRepository(databaseClient)),
    new ValidatorService(),
  );
};

const groupController = groupFactory();

const routes = Router();

routes.post("/group", groupController.create.bind(groupController));

export default routes;
