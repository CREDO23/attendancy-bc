import * as mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema<IAttandance>({
  id: mongoose.Types.ObjectId,
  studentId: mongoose.Types.ObjectId,
  date: Date
});

export const Attendance = mongoose.model('attendancies', attendanceSchema);
