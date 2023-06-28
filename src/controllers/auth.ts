/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import { User } from '../models/user';
import { JWTHelpers } from '../helpers/jwt';
import { JOIUserValidation } from '../helpers/joi/user';
import { BcryptHelpers } from '../helpers/bcrypt';

export class AuthControllers {
  static register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result: IUser = await JOIUserValidation.create.validateAsync(
        req.body
      );

      const isExist = await User.findOne({
        $or: [{ name: result.name }, { email: result.email }]
      });

      if (isExist) {
        throw error.Conflict('User already exists');
      }

      const newUser = new User({
        ...result
      });

      const savedUser = await newUser.save();
      const accessToken = await JWTHelpers.signAccessToken({
        id: savedUser._id,
        name: savedUser.name
      });

      res.json(<IClientResponse>{
        message: 'User created successfully',
        data: {
          user: savedUser,
          accessToken
        },
        error: null,
        success: true
      });
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  };

  static login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const result: IUser = await JOIUserValidation.login.validateAsync(
        req.body
      );

      const user = await User.findOne({ email: result.email });

      if (user) {
        const isMatch = await BcryptHelpers.comparePassword(
          result.password,
          user.password
        );

        if (isMatch) {
          const accessToken = await JWTHelpers.signAccessToken({
            id: user._id,
            name: user.name
          });

          console.log(accessToken);

          res.json(<IClientResponse>{
            message: `Logged as ${user.name}`,
            data: {
              user,
              accessToken
            },
            error: null,
            success: true
          });
        } else {
          throw error.NotFound('email --- or password incorrect');
        }
      } else {
        throw error.NotFound('email or . password incorrect');
      }
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  };
}
