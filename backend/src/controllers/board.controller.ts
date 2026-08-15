import type { Request, Response, NextFunction } from 'express';
import type { BoardService } from '../services/board.service.js';
import { validateRequest } from '../utils/validateRequest.js';
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdParamSchema,
} from '../common/schemas/board.schema.js';

export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validateRequest(
        req,
        createBoardSchema,
        'Invalid board data',
      );
      const board = await this.boardService.createBoard(data);
      res.status(201).json(board);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = validateRequest(
        req,
        boardIdParamSchema,
        'Invalid board ID',
        'params',
      );
      const board = await this.boardService.getBoardById(boardId);
      res.status(200).json(board);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = validateRequest(
        req,
        boardIdParamSchema,
        'Invalid board ID',
        'params',
      );
      const data = validateRequest(
        req,
        updateBoardSchema,
        'Invalid board data',
      );
      const board = await this.boardService.updateBoard(boardId, data);
      res.status(200).json(board);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = validateRequest(
        req,
        boardIdParamSchema,
        'Invalid board ID',
        'params',
      );
      await this.boardService.deleteBoard(boardId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
