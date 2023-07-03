import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance';

export const attendanceRouter = Router();

attendanceRouter.post('/new', AttendanceController.create);
attendanceRouter.get('/:id', AttendanceController.getOne);
attendanceRouter.get('/', AttendanceController.getAll);
attendanceRouter.put('/presence/:studentId', AttendanceController.addPresence);
attendanceRouter.delete('/delete/:id', AttendanceController.delete);
