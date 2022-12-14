import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailUnique } from '../../common/validators/is-email-unique.validator';

export class CreateUserParams {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateUserResponse {
  id: number;
  email: string;
}

export class LoginUserParams {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserResponse {
  token: string;
}
