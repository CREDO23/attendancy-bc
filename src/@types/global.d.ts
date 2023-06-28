import express from 'express';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

type TVacation = 'AV' | 'AP';

declare global {
  interface IClientResponse {
    message: string;
    data: unknown;
    error: unknown;
    success: boolean;
  }

  interface IStudent {
    id: mongoose.Types.ObjectId;
    firstName: string;
    lastname: string;
    middleName: string;
    vacation: TVacation;
  }

  interface IAdmin {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
  }

  interface IAttandance {
    id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    date: mongoose.Date;
  }

  interface IUserRequest extends express.Request {
    user: jwt.JwtPayload;
  }
}
