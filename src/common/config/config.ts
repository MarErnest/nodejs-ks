import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.ENV || 'DEVELOP',
  port: process.env.PORT || 3000,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwtSecret: process.env.JWT_SECRET || 'jwtSecret',
};

export default config;
