import * as joi from 'joi';

export class JOIUserValidation {
  static create = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
  });

  static login = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
  });

  static update = joi.object({
    name: joi.string(),
    email: joi.string(),
    password: joi.string()
  });
}
