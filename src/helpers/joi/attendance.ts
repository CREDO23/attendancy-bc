import * as joi from 'joi';

export class JOIAttendanceValidation {
  static create = joi.object({
    vacation: joi.string().valid('AV', 'AP').required()
  });

  static updatePresence = joi.object({
    date: joi.date().required(),
    vacation: joi.string().valid('AV', 'AP').required(),
    status: joi.string().valid('ABSENT', 'PRESENT').required()
  });
}
