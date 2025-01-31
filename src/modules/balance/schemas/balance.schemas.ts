import Joi from "joi";

const getAllBalances = Joi.object({
  groupId: Joi.number().required(),
});

export = { getAllBalances };
