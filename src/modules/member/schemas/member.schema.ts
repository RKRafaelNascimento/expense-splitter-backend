import Joi from "joi";

const createMember = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
});

export = { createMember };
