import * as mongoose from 'mongoose';
import { BcryptHelpers } from '../helpers/bcrypt';
import * as express from 'express';

const userSchema = new mongoose.Schema<IUser>({
  id: mongoose.Types.ObjectId,
  name: String,
  email: String,
  password: String
});

userSchema.pre('save', async function (next: express.NextFunction) {
  if (!this.isModified('password')) next();

  this.password = await BcryptHelpers.hashPassword(this.password);

  next();
});

export const User = mongoose.model('users', userSchema);
