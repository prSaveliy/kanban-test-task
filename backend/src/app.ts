import express from 'express';
import cors from 'cors';
import { getCorsSettings } from './utils/cors.js';

const buildApp = () => {
  const app = express();

  app.use(cors(getCorsSettings()));
  app.use(express.json());

  return app;
};

export default buildApp;
