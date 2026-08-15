import { Router } from 'express';
import { boardController } from '../controllers/index.js';

export const boardRoutes = Router();

boardRoutes.post('/', boardController.create.bind(boardController));
boardRoutes.get('/:boardId', boardController.getById.bind(boardController));
boardRoutes.patch('/:boardId', boardController.update.bind(boardController));
boardRoutes.delete('/:boardId', boardController.delete.bind(boardController));
