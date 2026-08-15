import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoardStore } from '../../store';
import { CreateBoardModal } from '../board/CreateBoardModal';

export const Header = () => {
  const navigate = useNavigate();
  const [boardIdInput, setBoardIdInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { error, clearError } = useBoardStore();

  const displayedError = localError || error;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmedId = boardIdInput.trim();
    if (!trimmedId) {
      setLocalError('Board ID is required');
      return;
    }

    setLocalError(null);
    clearError();
    setBoardIdInput('');
    navigate(`/boards/${trimmedId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-300 shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 min-h-[56px]">
            <div className="flex items-center gap-6 shrink-0">
              <Link
                to="/"
                onClick={() => {
                  clearError();
                  setLocalError(null);
                }}
                className="text-lg font-mono font-bold tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors uppercase select-none"
              >
                kanban
              </Link>
            </div>

            <div className="flex-1 max-w-lg mx-auto sm:mx-0 w-full relative flex items-center">
              <form
                onSubmit={handleSearch}
                className="flex gap-2 items-center w-full"
              >
                <input
                  type="text"
                  value={boardIdInput}
                  onChange={e => {
                    setBoardIdInput(e.target.value);
                    if (localError) setLocalError(null);
                    if (error) clearError();
                  }}
                  placeholder="Paste the board ID to find the board"
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-800 placeholder-neutral-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 transition-colors shrink-0"
                >
                  Find
                </button>
              </form>
              {displayedError && (
                <div className="absolute top-full left-0 pt-0.5 z-20">
                  <p className="text-[11px] font-mono text-red-600 tracking-tight bg-white px-1 shadow-xs border border-red-200">
                    {displayedError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 transition-colors shadow-xs"
              >
                + Create Board
              </button>
            </div>
          </div>
        </div>
      </header>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};
