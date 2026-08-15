import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '../../types';
import { useBoardStore } from '../../store';
import { CardModal } from './CardModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface CardItemProps {
  card: Card;
}

export const CardItem = ({ card }: CardItemProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteCard } = useBoardStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    try {
      await deleteCard(card.id);
    } catch {
      return;
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-dashed border-neutral-400 bg-neutral-100 min-h-[72px] p-3 transition-all"
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group relative bg-white border border-neutral-300 hover:border-neutral-500 p-3 shadow-xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug break-words flex-1">
            {card.title}
          </h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Edit card"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="p-1 text-neutral-500 hover:text-red-600 transition-colors"
              title="Delete card"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {card.description && (
          <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-wrap break-words">
            {card.description}
          </p>
        )}
      </div>

      <CardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialCard={card}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Card"
        message={`Are you sure you want to delete "${card.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </>
  );
};
