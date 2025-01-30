import Joi from "joi";

const createGroup = Joi.object({
  name: Joi.string().required(),
});

const addMember = Joi.object({
  groupId: Joi.number().required(),
  memberId: Joi.number().required(),
});

export = { createGroup, addMember };
