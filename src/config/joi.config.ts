import * as Joi from 'joi';

export const JoiConfig = Joi.object({
  NODE_ENV: Joi.string().required().default('dev'),
  PORT: Joi.number().required(),
  DB_DIALECT: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  HOST_API: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
