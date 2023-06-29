import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance';

export const attendanceRouter = Router();

attendanceRouter.get('/:id', AttendanceController.getOne);
attendanceRouter.get('/', AttendanceController.getAll);
attendanceRouter.put('/presence/:id', AttendanceController.addPresence);
attendanceRouter.delete('/delete/:id', AttendanceController.addPresence);
