import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { BoardView } from '../components/board';
import { useBoardStore } from '../store';

export const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, isLoading, error, fetchBoard } = useBoardStore();

  useEffect(() => {
    if (id) {
      void fetchBoard(id);
    }
  }, [id, fetchBoard]);

  return (
    <Layout>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex items-center gap-3 text-neutral-500 font-mono text-xs uppercase tracking-wider">
            <span className="inline-block w-2 h-2 bg-neutral-900 animate-pulse" />
            Loading board data...
          </div>
        </div>
      ) : error || !currentBoard ? (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-white border border-neutral-300 p-8 shadow-xs space-y-4">
            <div className="space-y-1 border-b border-neutral-200 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-red-600">
                Notice
              </span>
              <h2 className="text-lg font-bold font-mono tracking-tight text-neutral-900 uppercase">
                Board Not Found
              </h2>
            </div>
            <p className="text-xs text-neutral-600 font-mono break-all leading-relaxed">
              No board found matching ID:{' '}
              <span className="font-semibold text-neutral-900">{id}</span>
            </p>
            <div className="pt-2 flex gap-3">
              <Link
                to="/"
                className="px-3.5 py-2 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 transition-colors inline-block text-center"
              >
                Go to Main Page
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <BoardView board={currentBoard} />
      )}
    </Layout>
  );
};
