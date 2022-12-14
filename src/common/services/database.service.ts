import { Service } from 'typedi';
import { DataSource } from 'typeorm';
import User from '../../modules/user/user.entity';

@Service()
class DatabaseService {
  public mysqlDataSource: DataSource;

  public async connect() {
    this.mysqlDataSource = new DataSource({
      type: 'mysql',
      host: 'node-ks-mysql',
      port: 3306,
      username: 'node-ks-mysql',
      password: 'w3lc0m3l!',
      database: 'node-ks-mysql',
      entities: [__dirname + '/../../**/*.entity.js'],
      migrations: ['./dist/common/modules/database/migrations/*.js'],
      synchronize: true,
      logging: true,
      migrationsTableName: 'sys_migrations',
    });
    await this.mysqlDataSource.initialize();
  }

  public async seedUser() {
    const hasSeeded = await this.mysqlDataSource.manager.count(User);
    if (hasSeeded > 0) {
      console.log('User has already been seeded before...');
      return;
    }
    const user = new User();
    user.email = 'markernest.matute@gmail.com';
    user.password = '123456';
    await this.mysqlDataSource.manager.save(user);
    console.log('User has already been seeded...');
  }
}

export default DatabaseService;
