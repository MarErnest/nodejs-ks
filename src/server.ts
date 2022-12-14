import Container from 'typedi';
import App from './app';
import config from './common/config/config';
import DatabaseService from './common/services/database.service';

(async () => {
  const database = Container.get(DatabaseService);
  await database.connect();

  if (config.env !== 'PRODUCTION') {
    await database.seedUser();
  }

  const app = Container.get(App);
  const port = config.port;
  app.instance.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
})();
