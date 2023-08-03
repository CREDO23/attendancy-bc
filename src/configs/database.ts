/* eslint-disable no-console */
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConection = async (): Promise<void> => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('Database connection established'));
  } catch (error) {
    console.log(error);
  }
};
