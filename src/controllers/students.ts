import * as error from 'http-errors';
import * as express from 'express';
import { JOIStudentValidation } from '../helpers/joi/student';
import { Student } from '../models/student';

export class StudentControllers {
  static create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result: IStudent = await JOIStudentValidation.create.validateAsync(
        req.body
      );

      const isExeist = await Student.findOne({
        $and: [
          {
            middlename: {
              $regex: new RegExp(result.middlename, 'i')
            }
          },
          {
            lastname: {
              $regex: new RegExp(result.lastname, 'i')
            }
          }
        ]
      });

      if (isExeist) {
        throw error.Conflict('Student already exists');
      } else {
        const newStudent = new Student({ ...result });

        const savedStudent = await newStudent.save();

        res.json(<IClientResponse>{
          message: 'Student saved successfully',
          data: savedStudent,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static getOne = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const student = await Student.findById(id);

      if (!student) {
        throw error.NotFound('Student not found');
      } else {
        res.json(<IClientResponse>{
          message: 'Student',
          data: student,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const students = await Student.find({});

      if (!students) {
        throw error.NotFound('Not students yet');
      } else {
        res.json(<IClientResponse>{
          message: 'Students',
          data: students,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static update = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      console.log('credo');

      const result: IStudent = await JOIStudentValidation.update.validateAsync(
        req.body
      );

      const newStudent = await Student.findByIdAndUpdate(id, result, {
        new: true
      });

      if (!newStudent) {
        throw error.NotFound('Student not found');
      } else {
        res.json(<IClientResponse>{
          message: 'Student updated successfully',
          data: newStudent,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
        throw error.NotFound('Student not found');
      } else {
        res.json(<IClientResponse>{
          message: 'Student deleted successfully',
          data: deletedStudent,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
