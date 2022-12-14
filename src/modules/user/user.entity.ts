import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../common/config/config';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public hashedPassword: string;

  set password(rawPassword: string) {
    this.hashedPassword = bcrypt.hashSync(
      rawPassword,
      Number(config.bcryptSaltRounds),
    );
  }

  public doesPasswordMatch(rawPassword: string): boolean {
    return bcrypt.compareSync(`${rawPassword}`, this.hashedPassword);
  }

  public toJWTToken() {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
      },
      config.jwtSecret,
    );
  }
}
