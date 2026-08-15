import { prisma } from '../utils/prisma.js';
import { BoardRepository } from './board.repository.js';
import { CardRepository } from './card.repository.js';

export const boardRepository = new BoardRepository(prisma);
export const cardRepository = new CardRepository(prisma);

export { BoardRepository, CardRepository };
