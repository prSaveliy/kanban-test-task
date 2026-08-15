import type { Card } from './card';

export interface Column {
  id: number;
  name: string;
  order: number;
  boardId: string;
  cards: Card[];
}
