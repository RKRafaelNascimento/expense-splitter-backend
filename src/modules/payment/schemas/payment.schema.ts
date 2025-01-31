import Joi from "joi";

const payExpense = Joi.object({
  expenseId: Joi.number().required(),
  groupId: Joi.number().required(),
  memberId: Joi.number().required(),
});

export = { payExpense };
