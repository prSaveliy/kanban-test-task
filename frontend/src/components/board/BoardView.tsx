import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Board, Card } from '../../types';
import { useBoardStore } from '../../store';
import { BoardHeader } from './BoardHeader';
import { BoardColumn } from './BoardColumn';

interface BoardViewProps {
  board: Board;
}

export const BoardView = ({ board }: BoardViewProps) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [dragStartInfo, setDragStartInfo] = useState<{
    cardId: number;
    sourceColumnId: number;
    initialPosition: number;
  } | null>(null);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const { moveCard, moveCardOptimistic, setCurrentBoard } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findCardAndColumn = (
    cardId: number,
  ): { card: Card; columnId: number } | null => {
    for (const column of board.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) {
        return { card, columnId: column.id };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cardId = Number(active.id);
    const result = findCardAndColumn(cardId);
    if (result) {
      setActiveCard(result.card);
      setDragStartInfo({
        cardId,
        sourceColumnId: result.columnId,
        initialPosition: result.card.position,
      });
      setInitialBoard(board);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeInfo = findCardAndColumn(activeId);
    if (!activeInfo) return;

    const isOverColumn = String(overId).startsWith('column-');
    let targetColumnId: number | null = null;
    let newPosition: number;

    if (isOverColumn) {
      targetColumnId = Number(String(overId).replace('column-', ''));
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      if (!targetColumn) return;
      newPosition = targetColumn.cards.length;
    } else {
      const overCardId = Number(overId);
      const overInfo = findCardAndColumn(overCardId);
      if (!overInfo) return;
      targetColumnId = overInfo.columnId;
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      if (!targetColumn) return;
      const overIndex = targetColumn.cards.findIndex(c => c.id === overCardId);
      newPosition = overIndex >= 0 ? overIndex : targetColumn.cards.length;
    }

    if (activeInfo.columnId !== targetColumnId) {
      moveCardOptimistic(activeId, targetColumnId, newPosition);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const currentDragInfo = dragStartInfo;
    const originalBoard = initialBoard;

    setActiveCard(null);
    setDragStartInfo(null);
    setInitialBoard(null);

    if (!over) {
      if (originalBoard) {
        setCurrentBoard(originalBoard);
      }
      return;
    }

    const activeId = Number(active.id);
    const overId = over.id;

    if (!currentDragInfo) return;

    const isOverColumn = String(overId).startsWith('column-');
    let targetColumnId: number | null = null;
    let finalPosition: number;

    if (isOverColumn) {
      targetColumnId = Number(String(overId).replace('column-', ''));
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      if (!targetColumn) return;
      const currentIndex = targetColumn.cards.findIndex(c => c.id === activeId);
      finalPosition =
        currentIndex >= 0 ? currentIndex : targetColumn.cards.length;
    } else {
      const overCardId = Number(overId);
      const overInfo = findCardAndColumn(overCardId);
      if (!overInfo) return;
      targetColumnId = overInfo.columnId;
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      if (!targetColumn) return;

      const overIndex = targetColumn.cards.findIndex(c => c.id === overCardId);
      finalPosition = overIndex >= 0 ? overIndex : targetColumn.cards.length;
    }

    if (
      currentDragInfo.sourceColumnId === targetColumnId &&
      currentDragInfo.initialPosition === finalPosition
    ) {
      return;
    }

    if (targetColumnId !== null) {
      await moveCard(activeId, targetColumnId, finalPosition);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-100">
      <BoardHeader board={board} />

      <div className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
            {board.columns.map(column => (
              <BoardColumn key={column.id} column={column} />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="bg-white border-2 border-neutral-900 p-3 shadow-lg rotate-1 max-w-sm">
                <h3 className="text-sm font-semibold text-neutral-900 leading-snug break-words line-clamp-2">
                  {activeCard.title}
                </h3>
                {activeCard.description && (
                  <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-wrap break-words line-clamp-4">
                    {activeCard.description}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
