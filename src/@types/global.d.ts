import express from 'express';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
  type TVacation = 'AV' | 'AP';
  interface IClientResponse {
    message: string;
    data: unknown;
    error: unknown;
    success: boolean;
  }

  interface IStudent {
    id: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string;
    middlename: string;
    vacation: TVacation;
  }

  interface IUser {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
  }

  interface IAttandance {
    id: mongoose.Types.ObjectId;
    students: { id: mongoose.Types.ObjectId; status: boolean }[];
    date: mongoose.Date;
    vacation: TVacation;
  }

  interface IUserRequest extends express.Request {
    user: jwt.JwtPayload;
  }
}
