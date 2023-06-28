import * as mongoose from 'mongoose';

const adminSchema = new mongoose.Schema<IAdmin>({
  id: mongoose.Types.ObjectId,
  name: String,
  email: String,
  password: String
});

export const Admin = mongoose.model('admins', adminSchema);
