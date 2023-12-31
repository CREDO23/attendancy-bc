/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import { User } from '../models/user';
import { JOIUserValidation } from '../helpers/joi/user';
import { BcryptHelpers } from '../helpers/bcrypt';

export class UserControllers {
  static getUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select({
        password: 0,
        createdAt: 0,
        updatedAt: 0
      });

      if (!user) {
        throw error.NotFound('User not found');
      }

      res.json(<IClientResponse>{
        message: 'User',
        data: user,
        error: null,
        success: true
      });
    } catch (error) {
      next(error);
    }
  };

  static getUsers = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const users = await User.find({}).select({
        password: 0,
        createdAt: 0,
        updatedAt: 0
      });

      if (!users) {
        throw error.NotFound('Not users yet');
      }

      res.json(<IClientResponse>{
        message: 'users',
        data: users,
        error: null,
        success: true
      });
    } catch (error) {
      next(error);
    }
  };

  static updateUser = async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result = await JOIUserValidation.update.validateAsync(req.body);

      const { id } = req.params;
      const user = await User.findById(id);

      const requestId = req.user.id;

      if (user._id == requestId) {
        const user = await User.findByIdAndUpdate(id, result, {
          new: true
        });

        res.json(<IClientResponse>{
          message: 'Updated successfully',
          data: user,
          error: null,
          success: true
        });

        if (!user) {
          throw error.NotFound('User not found');
        }
      } else {
        throw error.Unauthorized('Unauthorized request');
      }
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  };

  static updatePassword = async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      const requestId = req.user.id;

      if (user._id == requestId) {
        const result = await JOIUserValidation.updatePassword.validateAsync(
          req.body
        );

        const isOldPasswordMatch = await BcryptHelpers.comparePassword(
          result.old,
          user.password
        );

        if (isOldPasswordMatch) {
          user.password = result.new;

          const updatedUser = await user.save();

          res.json(<IClientResponse>{
            message: 'Password changed successfully',
            data: updatedUser,
            error: null,
            success: true
          });
        } else {
          throw error.NotAcceptable('Incorect password');
        }
      } else {
        throw error.Unauthorized('Unauthorized request');
      }
    } catch (error) {
      next(error);
    }
  };

  static deleteUser = async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      const requestId = req.user.id;

      if (user._id == requestId) {
        const user = await User.findByIdAndDelete(id);

        res.json(<IClientResponse>{
          message: 'Deleted successfully',
          data: user,
          error: null,
          success: true
        });

        if (!user) {
          throw error.NotFound('User not found');
        }
      } else {
        throw error.Unauthorized('Unauthorized request');
      }
    } catch (error) {
      next(error);
    }
  };
}
