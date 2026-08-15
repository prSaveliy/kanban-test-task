import { useState, type FormEvent } from 'react';
import type { Card } from '../../types';
import { Modal } from '../common/Modal';
import { useBoardStore } from '../../store';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId?: number;
  initialCard?: Card | null;
}

const CardModalContent = ({
  isOpen,
  onClose,
  columnId,
  initialCard,
}: CardModalProps) => {
  const isEditing = Boolean(initialCard);
  const [title, setTitle] = useState(initialCard ? initialCard.title : '');
  const [description, setDescription] = useState(
    initialCard ? initialCard.description || '' : '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createCard, updateCard } = useBoardStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Card title is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditing && initialCard) {
        await updateCard(initialCard.id, trimmedTitle, description.trim());
      } else if (columnId !== undefined) {
        await createCard(columnId, trimmedTitle, description.trim());
      }
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to save card',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Card' : 'Add Card'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Card title..."
            autoFocus
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 placeholder-neutral-400 transition-colors"
          />
          {errorMessage && (
            <p className="mt-1 text-xs text-red-600 font-mono">
              {errorMessage}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details or context..."
            rows={4}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 placeholder-neutral-400 transition-colors resize-none font-sans"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white border border-neutral-900 transition-colors"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Create Card'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CardModal = (props: CardModalProps) => {
  if (!props.isOpen) return null;
  return <CardModalContent {...props} />;
};
