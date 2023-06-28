import * as express from 'express';
import * as http from 'http';

export default class App {
  app: express.Application = express();
  server: http.Server;

  public async init() {
    this.server = http.createServer(this.app);
  }
}
