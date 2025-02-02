import Joi from "joi";

const createExpenseBatch = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  groupId: Joi.number().required(),
  memberId: Joi.number().required(),
  memberIds: Joi.array().items(Joi.number()).optional(),
});

export = { createExpenseBatch };
