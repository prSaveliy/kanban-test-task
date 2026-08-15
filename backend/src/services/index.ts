import { boardRepository, cardRepository } from '../repositories/index.js';
import { BoardService } from './board.service.js';
import { CardService } from './card.service.js';

export const boardService = new BoardService(boardRepository);
export const cardService = new CardService(cardRepository);

export { BoardService, CardService };
