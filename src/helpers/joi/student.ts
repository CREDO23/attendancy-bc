import * as joi from 'joi';

export class JOIStudentValidation {
  static create = joi.object({
    firstname: joi.string(),
    lastname: joi.string().required(),
    middlename: joi.string().required(),
    vacation: joi.string().valid('AV', 'AP').required()
  });

  static update = joi.object({
    firstname: joi.string(),
    lastname: joi.string(),
    middlename: joi.string(),
    vacation: joi.string().valid('AV', 'AP')
  });
}
