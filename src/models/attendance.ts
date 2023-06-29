import * as mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema<IAttandance>({
  id: mongoose.Types.ObjectId,
  students: [
    { id: { type: mongoose.Types.ObjectId, ref: 'students' }, status: Boolean }
  ],
  date: {
    type: Date,
    defaultValue: new Date(Date.now()).toLocaleString().split(', ')[0]
  },
  vacation: String
});

export const Attendance = mongoose.model('attendancies', attendanceSchema);
