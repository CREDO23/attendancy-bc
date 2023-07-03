import * as joi from 'joi';

export class JOIAttendanceValidation {
  static create = joi.object({
    vacation: joi.string().valid('AV', 'AP').required()
  });
}
