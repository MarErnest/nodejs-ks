import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { Service } from 'typedi';
import config from './common/config/config';
import userController from './modules/user/user.controller';

@Service()
class App {
  public instance: express.Application;

  constructor() {
    this.instance = express();
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares() {
    this.instance.use(express.json());
  }

  private registerRoutes() {
    this.instance.get('/health', (req: Request, res: Response) => {
      res.json({
        hello: config.env,
      });
    });

    this.instance.use(userController.router);
  }
}

export default App;
