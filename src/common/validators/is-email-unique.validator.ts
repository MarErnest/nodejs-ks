import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import Container from 'typedi';
import User from '../../modules/user/user.entity';
import DatabaseService from '../services/database.service';

@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = Container.get(DatabaseService);
  }

  validate(email: string, args: ValidationArguments) {
    return this.databaseService.mysqlDataSource.manager
      .count(User, {
        where: {
          email,
        },
      })
      .then((count) => {
        return count === 0;
      });
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email is already used';
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
