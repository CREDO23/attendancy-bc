/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import App from './app';

dotenv.config();

const PORT = process.env.PORT || 5500;

const app: App = new App();

app.init().then(() => {
  app.server.listen(PORT, () => console.log(`Server listing on ${PORT}`));
});
