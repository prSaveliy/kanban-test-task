export interface Card {
  id: number;
  title: string;
  description: string;
  position: number;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  columnId: number;
  title: string;
  description?: string;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
}

export interface MoveCardDto {
  targetColumnId: number;
  newPosition: number;
}
