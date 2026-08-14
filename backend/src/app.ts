import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { getCorsSettings } from './utils/cors.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './utils/errorHandler.js';

const buildApp = () => {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      customSuccessMessage: (req, res, responseTime) =>
        `${req.method} ${req.url} ${res.statusCode} in ${responseTime}ms`,
      customErrorMessage: (req, res, err) =>
        `${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
      serializers: {
        req: () => undefined,
        res: () => undefined,
        err: () => undefined,
      },
    }),
  );
  app.use(cors(getCorsSettings()));
  app.use(express.json());

  app.use(errorHandler);

  return app;
};

export default buildApp;
