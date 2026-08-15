import { validateEnv } from './config/validateEnv.js';
import buildApp from './app.js';

validateEnv();

const start = () => {
  const app = buildApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
