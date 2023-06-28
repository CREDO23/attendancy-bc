import * as mongoose from 'mongoose';

const studentSchema = new mongoose.Schema<IStudent>({
  id: mongoose.Types.ObjectId,
  firstName: String,
  lastname: String,
  middleName: String,
  vacation: String
});

export const Student = mongoose.model('students', studentSchema);
