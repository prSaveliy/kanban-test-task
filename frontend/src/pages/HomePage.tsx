import { useState } from 'react';
import { Layout } from '../components/layout';
import { CreateBoardModal } from '../components/board';

export const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full bg-white border border-neutral-300 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-neutral-200 pb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Workspace
            </span>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-neutral-900 uppercase">
              Kanban Board
            </h1>
            <p className="text-sm text-neutral-600 font-sans leading-relaxed">
              To open an existing board, paste the board ID in the search field
              above and click Find. Or create a new board to get started with
              ToDo, In Progress, and Done columns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 px-4 py-3 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 transition-colors text-center"
            >
              + Create New Board
            </button>
          </div>
        </div>
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Layout>
  );
};
