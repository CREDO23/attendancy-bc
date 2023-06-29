import * as error from 'http-errors';
import * as express from 'express';
import { Attendance } from '../models/attendance';
import { JOIAttendanceValidation } from '../helpers/joi/attendance';
import { Student } from '../models/student';

export class AttendanceController {
  static create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result = await JOIAttendanceValidation.create.validateAsync(
        req.body
      );
      const date = new Date(Date.now());

      const hour = date.getHours();

      const vacation =
        8 < hour && hour < 12 ? 'AV' : hour > 12 && hour < 17 ? 'AP' : null;

      const isExist = await Attendance.find({ $and: [{ date }, { vacation }] });

      if (isExist) {
        throw error.Conflict('The attendance has already been created');
      } else {
        const studentIds = await Student.find({ vacation }, { _id: 1 });

        const newAttendance = new Attendance({
          vacation: result.vacation,
          date: date.toLocaleString(),
          students: [
            ...studentIds.map((studentId) => {
              return {
                id: studentId,
                status: false
              };
            })
          ]
        });

        const savedAttendance = await newAttendance.save();

        res.json(<IClientResponse>{
          message: 'Attendance created successfully',
          data: savedAttendance,
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

      const attendance = await Attendance.findById(id);

      if (!attendance) {
        throw error.NotFound('Attendance not found');
      } else {
        res.json(<IClientResponse>{
          message: 'Attendance',
          data: attendance,
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
      const attancies = await Attendance.find({});

      if (!attancies) {
        throw error.NotFound('Not attancies yet');
      } else {
        res.json(<IClientResponse>{
          message: 'Attendancies',
          data: attancies,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static addPresence = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { studentId } = req.params;

      const student = await Student.findById(studentId);

      if (!student) {
        throw error.NotFound('Student not found');
      } else {
        const date = new Date(Date.now());

        const hour = date.getHours();

        const vacation =
          8 < hour && hour < 12 ? 'AV' : hour > 12 && hour < 17 ? 'AP' : null;

        const attendance = await Attendance.findOne({
          $and: [{ date: date.toLocaleString().split(', ')[0] }, { vacation }]
        });

        attendance.students.map((student) => {
          if (new String(student.id) == studentId) {
            student.status = true;
          }
        });

        const updatedAttendance = attendance.save();

        res.json(<IClientResponse>{
          message: `${student.lastname}`,
          data: updatedAttendance,
          error: null,
          success: false
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

      const deletedAttendance = await Attendance.findByIdAndDelete(id);

      if (!deletedAttendance) {
        throw error.NotFound('Attendance not found');
      } else {
        res.json(<IClientResponse>{
          message: 'Attendance deleted successfully',
          data: deletedAttendance,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
