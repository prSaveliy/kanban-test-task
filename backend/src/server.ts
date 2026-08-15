import { validateEnv } from './config/validateEnv.js';
import buildApp from './app.js';

validateEnv();

const start = () => {
  const app = buildApp();
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || 'localhost';

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
};

start();
