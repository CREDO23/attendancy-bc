import * as mongoose from 'mongoose';

const studentSchema = new mongoose.Schema<IStudent>({
  id: mongoose.Types.ObjectId,
  firstname: String,
  lastname: String,
  middlename: String,
  vacation: String
});

export const Student = mongoose.model('students', studentSchema);
