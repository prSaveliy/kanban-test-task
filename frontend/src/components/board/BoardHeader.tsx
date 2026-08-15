import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Board } from '../../types';
import { useBoardStore } from '../../store';
import { EditBoardModal } from './EditBoardModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface BoardHeaderProps {
  board: Board;
}

export const BoardHeader = ({ board }: BoardHeaderProps) => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteBoard } = useBoardStore();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(board.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = board.id;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBoard(board.id);
      navigate('/');
    } catch {
      return;
    }
  };

  return (
    <>
      <div className="bg-white border-b border-neutral-300 py-3.5 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 min-w-0 max-w-full">
            <h1
              title={board.name}
              className="text-xl font-bold font-mono tracking-tight text-neutral-900 uppercase truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
            >
              {board.name}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-neutral-400">ID:</span>
              <code className="text-xs font-mono bg-neutral-100 px-2 py-0.5 border border-neutral-200 text-neutral-700 select-all">
                {board.id}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 transition-colors"
                title="Copy Board ID"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 transition-colors"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-white hover:bg-red-50 border border-red-300 text-red-700 transition-colors"
            >
              Delete Board
            </button>
          </div>
        </div>
      </div>

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        boardId={board.id}
        initialName={board.name}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Board"
        message={`Are you sure you want to delete "${board.name}"? All columns and cards will be permanently removed.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </>
  );
};
