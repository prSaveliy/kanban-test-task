import { apiClient } from '../utils/apiClient';
import type { Card, CreateCardDto, UpdateCardDto, MoveCardDto } from '../types';

export const cardService = {
  createCard: async (data: CreateCardDto): Promise<Card> => {
    const response = await apiClient.post<Card>('/cards', data);
    return response.data;
  },

  updateCard: async (cardId: number, data: UpdateCardDto): Promise<Card> => {
    const response = await apiClient.patch<Card>(`/cards/${cardId}`, data);
    return response.data;
  },

  deleteCard: async (cardId: number): Promise<void> => {
    await apiClient.delete(`/cards/${cardId}`);
  },

  moveCard: async (cardId: number, data: MoveCardDto): Promise<Card> => {
    const response = await apiClient.patch<Card>(`/cards/${cardId}/move`, data);
    return response.data;
  },
};
