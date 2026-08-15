import { apiClient } from '../utils/apiClient';
import type { Board, CreateBoardDto, UpdateBoardDto } from '../types';

export const boardService = {
  createBoard: async (data: CreateBoardDto): Promise<Board> => {
    const response = await apiClient.post<Board>('/boards', data);
    return response.data;
  },

  getBoardById: async (boardId: string): Promise<Board> => {
    const response = await apiClient.get<Board>(`/boards/${boardId}`);
    return response.data;
  },

  updateBoard: async (
    boardId: string,
    data: UpdateBoardDto,
  ): Promise<Board> => {
    const response = await apiClient.patch<Board>(`/boards/${boardId}`, data);
    return response.data;
  },

  deleteBoard: async (boardId: string): Promise<void> => {
    await apiClient.delete(`/boards/${boardId}`);
  },
};
