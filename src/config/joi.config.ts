import * as Joi from 'joi';

export const JoiConfig = Joi.object({
  NODE_ENV: Joi.string().required().default('dev'),
  PORT: Joi.number().required(),
});
