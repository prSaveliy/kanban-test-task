import { create } from 'zustand';
import type { Board, Card, Column } from '../types';
import { boardService, cardService } from '../services';

interface BoardState {
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  activeCard: Card | null;
  setCurrentBoard: (board: Board | null) => void;
  setActiveCard: (card: Card | null) => void;
  clearError: () => void;
  fetchBoard: (boardId: string) => Promise<Board | null>;
  createBoard: (name: string) => Promise<Board>;
  updateBoard: (boardId: string, name: string) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  createCard: (columnId: number, title: string, description?: string) => Promise<void>;
  updateCard: (cardId: number, title?: string, description?: string) => Promise<void>;
  deleteCard: (cardId: number) => Promise<void>;
  moveCard: (cardId: number, targetColumnId: number, newPosition: number) => Promise<void>;
  moveCardOptimistic: (cardId: number, targetColumnId: number, newPosition: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  isLoading: false,
  error: null,
  activeCard: null,

  setCurrentBoard: (board: Board | null) => {
    set({ currentBoard: board });
  },

  setActiveCard: (card: Card | null) => {
    set({ activeCard: card });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchBoard: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const board = await boardService.getBoardById(boardId);
      set({ currentBoard: board, isLoading: false });
      return board;
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Board not found'
          : 'Board not found';
      set({ error: message, isLoading: false, currentBoard: null });
      return null;
    }
  },

  createBoard: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const board = await boardService.createBoard({ name });
      set({ currentBoard: board, isLoading: false });
      return board;
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to create board'
          : 'Failed to create board';
      set({ error: message, isLoading: false });
      throw new Error(message, { cause: err });
    }
  },

  updateBoard: async (boardId: string, name: string) => {
    const previousBoard = get().currentBoard;
    if (previousBoard && previousBoard.id === boardId) {
      set({ currentBoard: { ...previousBoard, name } });
    }
    try {
      const updated = await boardService.updateBoard(boardId, { name });
      const current = get().currentBoard;
      if (current && current.id === boardId) {
        set({ currentBoard: { ...current, name: updated.name, updatedAt: updated.updatedAt } });
      }
    } catch (err: unknown) {
      if (previousBoard) {
        set({ currentBoard: previousBoard });
      }
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to update board'
          : 'Failed to update board';
      set({ error: message });
      throw new Error(message, { cause: err });
    }
  },

  deleteBoard: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      await boardService.deleteBoard(boardId);
      set({ currentBoard: null, isLoading: false });
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to delete board'
          : 'Failed to delete board';
      set({ error: message, isLoading: false });
      throw new Error(message, { cause: err });
    }
  },

  createCard: async (columnId: number, title: string, description?: string) => {
    const current = get().currentBoard;
    if (!current) return;
    try {
      const newCard = await cardService.createCard({ columnId, title, description });
      const updatedColumns = current.columns.map((col: Column) => {
        if (col.id === columnId) {
          const cards = [...col.cards, newCard].sort((a, b) => a.position - b.position);
          return { ...col, cards };
        }
        return col;
      });
      set({ currentBoard: { ...current, columns: updatedColumns } });
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to create card'
          : 'Failed to create card';
      set({ error: message });
      throw new Error(message, { cause: err });
    }
  },

  updateCard: async (cardId: number, title?: string, description?: string) => {
    const current = get().currentBoard;
    if (!current) return;
    const previousBoard = current;

    const updatedColumns = current.columns.map((col: Column) => ({
      ...col,
      cards: col.cards.map((card: Card) => {
        if (card.id === cardId) {
          return {
            ...card,
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
          };
        }
        return card;
      }),
    }));

    set({ currentBoard: { ...current, columns: updatedColumns } });

    try {
      const updatedCard = await cardService.updateCard(cardId, { title, description });
      const refreshedColumns = get().currentBoard?.columns.map((col: Column) => ({
        ...col,
        cards: col.cards.map((card: Card) => (card.id === cardId ? updatedCard : card)),
      }));
      if (refreshedColumns && get().currentBoard) {
        set({ currentBoard: { ...get().currentBoard!, columns: refreshedColumns } });
      }
    } catch (err: unknown) {
      set({ currentBoard: previousBoard });
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to update card'
          : 'Failed to update card';
      set({ error: message });
      throw new Error(message, { cause: err });
    }
  },

  deleteCard: async (cardId: number) => {
    const current = get().currentBoard;
    if (!current) return;
    const previousBoard = current;

    const updatedColumns = current.columns.map((col: Column) => {
      const filteredCards = col.cards
        .filter((card: Card) => card.id !== cardId)
        .map((card: Card, index: number) => ({ ...card, position: index }));
      return { ...col, cards: filteredCards };
    });

    set({ currentBoard: { ...current, columns: updatedColumns } });

    try {
      await cardService.deleteCard(cardId);
    } catch (err: unknown) {
      set({ currentBoard: previousBoard });
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to delete card'
          : 'Failed to delete card';
      set({ error: message });
      throw new Error(message, { cause: err });
    }
  },

  moveCardOptimistic: (cardId: number, targetColumnId: number, newPosition: number) => {
    const current = get().currentBoard;
    if (!current) return;

    let targetCard: Card | null = null;
    let sourceColumnId: number | null = null;

    for (const col of current.columns) {
      const found = col.cards.find((c: Card) => c.id === cardId);
      if (found) {
        targetCard = found;
        sourceColumnId = col.id;
        break;
      }
    }

    if (!targetCard || sourceColumnId === null) return;

    const newColumns = current.columns.map((col: Column) => {
      if (col.id === sourceColumnId && sourceColumnId === targetColumnId) {
        const remaining = col.cards.filter((c: Card) => c.id !== cardId);
        const clampedPosition = Math.max(0, Math.min(newPosition, remaining.length));
        remaining.splice(clampedPosition, 0, { ...targetCard!, columnId: targetColumnId });
        return {
          ...col,
          cards: remaining.map((card: Card, index: number) => ({ ...card, position: index })),
        };
      }

      if (col.id === sourceColumnId) {
        const remaining = col.cards.filter((c: Card) => c.id !== cardId);
        return {
          ...col,
          cards: remaining.map((card: Card, index: number) => ({ ...card, position: index })),
        };
      }

      if (col.id === targetColumnId) {
        const cards = [...col.cards];
        const clampedPosition = Math.max(0, Math.min(newPosition, cards.length));
        cards.splice(clampedPosition, 0, { ...targetCard!, columnId: targetColumnId });
        return {
          ...col,
          cards: cards.map((card: Card, index: number) => ({ ...card, position: index })),
        };
      }

      return col;
    });

    set({ currentBoard: { ...current, columns: newColumns } });
  },

  moveCard: async (cardId: number, targetColumnId: number, newPosition: number) => {
    const boardId = get().currentBoard?.id;
    get().moveCardOptimistic(cardId, targetColumnId, newPosition);
    try {
      await cardService.moveCard(cardId, { targetColumnId, newPosition });
    } catch (err: unknown) {
      if (boardId) {
        await get().fetchBoard(boardId);
      }
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to move card'
          : 'Failed to move card';
      set({ error: message });
    }
  },
}));
