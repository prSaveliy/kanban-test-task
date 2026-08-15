import type { Request, Response, NextFunction } from 'express';
import type { CardService } from '../services/card.service.js';
import { validateRequest } from '../utils/validateRequest.js';
import {
  createCardSchema,
  updateCardSchema,
  cardIdParamSchema,
  moveCardSchema,
} from '../common/schemas/card.schema.js';

export class CardController {
  constructor(private readonly cardService: CardService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validateRequest(req, createCardSchema, 'Invalid card data');
      const card = await this.cardService.createCard(data);
      res.status(201).json(card);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = validateRequest(
        req,
        cardIdParamSchema,
        'Invalid card ID',
        'params',
      );
      const data = validateRequest(req, updateCardSchema, 'Invalid card data');
      const card = await this.cardService.updateCard(cardId, data);
      res.status(200).json(card);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = validateRequest(
        req,
        cardIdParamSchema,
        'Invalid card ID',
        'params',
      );
      await this.cardService.deleteCard(cardId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async move(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = validateRequest(
        req,
        cardIdParamSchema,
        'Invalid card ID',
        'params',
      );
      const data = validateRequest(
        req,
        moveCardSchema,
        'Invalid move parameters',
      );
      const updatedCard = await this.cardService.moveCard(cardId, data);
      res.status(200).json(updatedCard);
    } catch (err) {
      next(err);
    }
  }
}
