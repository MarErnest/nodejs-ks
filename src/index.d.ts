import User from './modules/user/user.entity';

declare global {
  declare namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
