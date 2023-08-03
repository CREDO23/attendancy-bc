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
      const date = new Date(Date.now()).toDateString();

      const isExist = await Attendance.find({
        $and: [{ date }, { vacation: result.vacation }]
      });

      if (isExist[0]) {
        throw error.Conflict(
          'Attendance for this vacation has already been created'
        );
      } else {
        const studentIds = await Student.find(
          { vacation: result.vacation },
          { _id: 1 }
        );

        const newAttendance = new Attendance({
          vacation: result.vacation,
          date: date.toLocaleString(),
          students: [
            ...studentIds.map((studentId) => {
              return {
                student: studentId._id,
                status: 'ABSENT'
              };
            })
          ]
        });

        const savedAttendance = (await newAttendance.save()).populate({
          path: 'students',
          populate: {
            path: 'student'
          }
        });

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

      const attendance = await Attendance.findById(id).populate({
        path: 'students',
        populate: {
          path: 'student'
        }
      });

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
      const attancies = await Attendance.find({}).populate({
        path: 'students',
        populate: {
          path: 'student'
        }
      });

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

        const attendance = await Attendance.findOne({
          $and: [{ date: date.toDateString() }, { vacation: student.vacation }]
        });

        attendance.students.map((student) => {
          if (new String(student.student) == studentId) {
            student.status = 'PRESENT';
          }
        });

        const updatedAttendance = (await attendance.save()).populate({
          path: 'students',
          populate: {
            path: 'student'
          }
        });

        res.json(<IClientResponse>{
          message: `${student.lastname}`,
          data: updatedAttendance,
          error: null,
          success: true
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static updatePresence = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result = await JOIAttendanceValidation.updatePresence.validateAsync(
        req.body
      );

      const { studentId } = req.params;

      const attendance = await Attendance.findOne({
        $and: [{ date: result.date }, { vacation: result.vacation }]
      });

      attendance.students.map((student) => {
        if (String(student.student) == String(studentId)) {
          student.status = result.status;
        }
      });

      const updatedAttendance = (await attendance.save()).populate({
        path: 'students',
        populate: {
          path: 'student'
        }
      });

      res.json(<IClientResponse>{
        message: 'Presence updated successfully',
        data: updatedAttendance,
        error: null,
        success: true
      });
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
