import type { Column } from './column';

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
}

export interface CreateBoardDto {
  name: string;
}

export interface UpdateBoardDto {
  name: string;
}
