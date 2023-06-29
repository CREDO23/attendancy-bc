/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as httpError from 'http-errors';
import { dbConection } from './configs/database';
import { authRouter } from './routes/auth';
import { tokenGuard } from './middlewares/tokenGuard';
import { userRouter } from './routes/user';
import { studentRouter } from './routes/students';
import { attendanceRouter } from './routes/attendance';

export default class App {
  app: express.Application = express();
  server: http.Server;

  public async init() {
    this.server = http.createServer(this.app);
    this.connectDb();
    this.middleware();
    this.routes();
    this.errorsHandlers();
  }

  private connectDb() {
    dbConection();
  }

  private middleware() {
    this.app.use(cors());
    this.app.use(morgan(':method :url :status :response-time ms'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public baseRoute(req: express.Request, res: express.Response): void {
    res.json({
      message: 'Server is running'
    });
  }

  public routes(): void {
    this.app.get('/', this.baseRoute);
    this.app.use('/api/auth', authRouter);
    this.app.use(tokenGuard);
    this.app.use('/api/users', userRouter);
    this.app.use('/api/students', studentRouter);
    this.app.use('/api/attendance', attendanceRouter);
  }

  private errorsHandlers(): void {
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        next(new httpError.NotFound('URL not found'));
      }
    );

    this.app.use(
      (
        error: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.status(error.status || 500);

        res.json(<IClientResponse>{
          data: null,
          message: error.message,
          success: false,
          error
        });
      }
    );
  }
}
