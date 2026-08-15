import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoardStore } from '../../store';
import { CreateBoardModal } from '../board/CreateBoardModal';

export const Header = () => {
  const navigate = useNavigate();
  const [boardIdInput, setBoardIdInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { fetchBoard } = useBoardStore();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedId = boardIdInput.trim();
    if (!trimmedId) {
      setSearchError('Board ID is required');
      return;
    }

    setSearchError(null);
    const board = await fetchBoard(trimmedId);
    if (board) {
      setBoardIdInput('');
      setSearchError(null);
      navigate(`/boards/${board.id}`);
    } else {
      setSearchError('Board not found with the provided ID');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-300 shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-lg font-mono font-bold tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors uppercase select-none"
              >
                kanban
              </Link>
            </div>

            <div className="flex-1 max-w-lg mx-auto sm:mx-0 w-full">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={boardIdInput}
                  onChange={e => {
                    setBoardIdInput(e.target.value);
                    if (searchError) setSearchError(null);
                  }}
                  placeholder="Paste the board ID to find the board"
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-800 placeholder-neutral-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 transition-colors"
                >
                  Find
                </button>
              </form>
              <div className="mt-1 min-h-[16px]">
                {searchError && (
                  <p className="text-[11px] font-mono text-red-600 tracking-tight">
                    {searchError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
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
