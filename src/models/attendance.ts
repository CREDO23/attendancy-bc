import * as mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema<IAttandance>({
  id: mongoose.Types.ObjectId,
  students: [
    {
      student: { type: mongoose.Types.ObjectId, ref: 'students' },
      status: {
        type: String,
        default: 'ABSENT'
      }
    }
  ],
  date: {
    type: Date,
    defaultValue: new Date(Date.now()).toLocaleString().split(', ')[0]
  },
  vacation: String
});

export const Attendance = mongoose.model('attendancies', attendanceSchema);
