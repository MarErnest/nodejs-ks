import express from 'express';
import { ApiResponse } from '../dtos/api-response.dtos';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import DatabaseService from '../services/database.service';
import Container from 'typedi';
import User from '../../modules/user/user.entity';

export const IsUserAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const unauthorizedResponse = new ApiResponse<boolean>();
  unauthorizedResponse.message = 'Invalid user session';
  unauthorizedResponse.status = false;

  // check headers
  if (!req.headers || (req.headers && !req.headers['authorization'])) {
    res.statusCode = 401;
    res.json(unauthorizedResponse);
    return;
  }

  // extract auth token
  const authHeader = req.headers.authorization || '';
  const splitAuthorization = authHeader.split('Bearer');

  // Verify Token
  const token = splitAuthorization[1].trim();

  try {
    const decoded = (await jwt.verify(token, config.jwtSecret)) as User;

    // query user if still exists
    const databaseService = Container.get(DatabaseService);
    const user = await databaseService.mysqlDataSource.manager.findOne(User, {
      where: {
        email: decoded.email,
      },
      select: ['id', 'email'],
    });
    if (!user) {
      throw Error('User not found.');
    }

    req.user = user;

    // Attach user to request
  } catch (error) {
    res.statusCode = 401;
    res.json(unauthorizedResponse);
    return;
  }
  await next();
};
