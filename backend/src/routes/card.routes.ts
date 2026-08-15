import { Router } from 'express';
import { cardController } from '../controllers/index.js';

export const cardRoutes = Router();

cardRoutes.post('/', cardController.create.bind(cardController));
cardRoutes.patch('/:cardId', cardController.update.bind(cardController));
cardRoutes.delete('/:cardId', cardController.delete.bind(cardController));
cardRoutes.patch('/:cardId/move', cardController.move.bind(cardController));
