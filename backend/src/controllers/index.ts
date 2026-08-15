import { boardService, cardService } from '../services/index.js';
import { BoardController } from './board.controller.js';
import { CardController } from './card.controller.js';

export const boardController = new BoardController(boardService);
export const cardController = new CardController(cardService);

export { BoardController, CardController };
