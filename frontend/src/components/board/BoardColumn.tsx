import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Column } from '../../types';
import { CardItem } from '../card/CardItem';
import { CardModal } from '../card/CardModal';

interface BoardColumnProps {
  column: Column;
}

export const BoardColumn = ({ column }: BoardColumnProps) => {
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'Column',
      column,
    },
  });

  const cardIds = column.cards.map((card) => card.id);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`flex flex-col bg-neutral-50/70 border border-neutral-300 h-full min-h-[500px] transition-colors ${
          isOver ? 'bg-neutral-100 border-neutral-400 ring-1 ring-neutral-400' : ''
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
              {column.name}
            </h2>
            <span className="text-[11px] font-mono px-1.5 py-0.2 bg-neutral-100 border border-neutral-200 text-neutral-600">
              {column.cards.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardModalOpen(true)}
            className="text-xs font-mono tracking-wide text-neutral-600 hover:text-neutral-950 uppercase transition-colors px-1.5 py-0.5 hover:bg-neutral-100 border border-transparent hover:border-neutral-300"
          >
            + Add Card
          </button>
        </div>

        <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </SortableContext>

          {column.cards.length === 0 && (
            <div className="h-32 border border-dashed border-neutral-300 flex items-center justify-center text-xs font-mono text-neutral-400 uppercase tracking-wider select-none">
              Empty column
            </div>
          )}
        </div>
      </div>

      <CardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        columnId={column.id}
      />
    </>
  );
};
