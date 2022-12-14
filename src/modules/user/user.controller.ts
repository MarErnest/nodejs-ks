import { Router, Request, Response } from 'express';
import Container, { Service } from 'typedi';
import { BadRequestError } from '../../common/errors/bad-request.error';
import { UnauthorizedRequestError } from '../../common/errors/unauthorized-request.error';
import { IsUserAuthenticated } from '../../common/middlewares/is-user-authenticated.middleware';
import UserService from './user.service';

@Service()
class UserController {
  public router: Router;
  private userService: UserService;

  constructor() {
    this.userService = Container.get(UserService);
    this.router = Router();
    this.router.post('/user', this.createUser);
    this.router.post('/user/login', this.loginUser);
    this.router.get('/user/session', IsUserAuthenticated, this.getUserSession);
  }

  private createUser = async (req: Request, res: Response) => {
    try {
      const response = await this.userService.createUser(req.body);
      res.statusCode = 201;
      res.json(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.statusCode = 400;
        res.json(error.response);
        return res;
      }
      res.statusCode = 500;
      res.json({
        message: 'Internal Server Error',
      });
    }
  };

  private loginUser = async (req: Request, res: Response) => {
    try {
      const response = await this.userService.loginUser(req.body);
      res.statusCode = 200;
      res.json(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.statusCode = 400;
        res.json(error.response);
        return;
      }

      if (error instanceof UnauthorizedRequestError) {
        res.statusCode = 401;
        res.json(error.response);
        return;
      }

      res.statusCode = 500;
      res.json({
        message: 'Internal Server Error',
      });
    }
  };

  private getUserSession = async (req: Request, res: Response) => {
    try {
      res.statusCode = 200;
      res.json({
        user: req.user,
      });
    } catch (error) {
      res.statusCode = 500;
      res.json({
        message: 'Internal Server Error',
      });
    }
  };
}

export default new UserController();
