import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { useBoardStore } from '../../store';
import { LIMITS } from '../../utils/constants';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBoardModal = ({
  isOpen,
  onClose,
}: CreateBoardModalProps) => {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createBoard } = useBoardStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = boardName.trim();
    if (!trimmed) {
      setErrorMessage('Board name is required');
      return;
    }
    if (trimmed.length > LIMITS.BOARD_NAME_MAX) {
      setErrorMessage(
        `Board name must be ${LIMITS.BOARD_NAME_MAX} characters or fewer`,
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const board = await createBoard(trimmed);
      setBoardName('');
      onClose();
      navigate(`/boards/${board.id}`);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create board',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBoardName('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600">
              Board Name
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              {boardName.length}/{LIMITS.BOARD_NAME_MAX}
            </span>
          </div>
          <input
            type="text"
            value={boardName}
            maxLength={LIMITS.BOARD_NAME_MAX}
            onChange={e => {
              setBoardName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. Sprint 1 Kanban"
            autoFocus
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 placeholder-neutral-400 transition-colors"
          />
          {errorMessage && (
            <p className="mt-1 text-xs text-red-600 font-mono">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white border border-neutral-900 transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
