import * as joi from 'joi';

export class JOIAdminValidation {
  static create = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
  });
}
