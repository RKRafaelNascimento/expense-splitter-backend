import { Router } from "express";
import { MemberController, MemberService, MemberRepository } from ".";
import { ValidatorService } from "@/shared/Validator";
import { DatabaseClient } from "@/infra/database";
import { IMemberController } from "./interfaces";

const memberFactory = (): IMemberController => {
  const databaseClient = DatabaseClient.getInstance();
  return new MemberController(
    new MemberService(new MemberRepository(databaseClient)),
    new ValidatorService(),
  );
};

const memberController = memberFactory();

const routes = Router();

routes.post("/member", memberController.create.bind(memberController));

export default routes;
