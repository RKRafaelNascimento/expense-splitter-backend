import Joi from "joi";

const createGroup = Joi.object({
  name: Joi.string().required(),
});

export = { createGroup };
