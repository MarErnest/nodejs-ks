import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import Container, { Service } from 'typedi';
import { ApiResponse } from '../../common/dtos/api-response.dtos';
import { BadRequestError } from '../../common/errors/bad-request.error';
import { UnauthorizedRequestError } from '../../common/errors/unauthorized-request.error';
import DatabaseService from '../../common/services/database.service';
import {
  CreateUserParams,
  CreateUserResponse,
  LoginUserParams,
  LoginUserResponse,
} from './user.dtos';
import User from './user.entity';

@Service()
class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = Container.get(DatabaseService);
  }

  public createUser = async (
    params: CreateUserParams,
  ): Promise<ApiResponse<CreateUserResponse>> => {
    // Response
    const response = new ApiResponse<CreateUserResponse>();

    // Validation
    const createUserParams = plainToClass(CreateUserParams, params);
    const validation = await validateAndExtract(createUserParams);
    if (!validation.isValid) {
      response.validationErrors = validation.errors;
      response.status = false;
      response.message = 'Create user validation failed';
      throw new BadRequestError(response);
    }

    // Parameter spreading
    const { email, password } = createUserParams;

    // Logic
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    await this.databaseService.mysqlDataSource.manager.save(newUser);

    // Response
    response.status = true;
    response.data = {
      id: newUser.id,
      email,
    };
    response.message = 'User successfully created';

    // Return
    return response;
  };

  public loginUser = async (
    params: LoginUserParams,
  ): Promise<ApiResponse<LoginUserResponse>> => {
    // Response
    const response = new ApiResponse<LoginUserResponse>();

    // Validation
    const loginUserParams = plainToClass(LoginUserParams, params);
    const validation = await validateAndExtract(loginUserParams);
    if (!validation.isValid) {
      response.validationErrors = validation.errors;
      response.status = false;
      response.message = 'Login user failed';
      throw new BadRequestError(response);
    }

    // Parameter Spreading
    const { email, password } = loginUserParams;

    // Logic
    const user = await this.databaseService.mysqlDataSource.manager.findOne(
      User,
      {
        where: {
          email,
        },
      },
    );

    // Check User Existence
    if (!user || (user && !user.doesPasswordMatch(password))) {
      response.message = 'Login failed';
      response.status = false;
      throw new UnauthorizedRequestError(response);
    }

    // Return
    response.data = {
      token: user.toJWTToken(),
    };

    return response;
  };
}

export default UserService;
