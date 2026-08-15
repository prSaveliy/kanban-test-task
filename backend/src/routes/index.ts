import { Router } from 'express';
import { boardRoutes } from './board.routes.js';
import { cardRoutes } from './card.routes.js';
import { healthRoutes } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/boards', boardRoutes);
apiRouter.use('/cards', cardRoutes);

export { boardRoutes, cardRoutes, healthRoutes };
