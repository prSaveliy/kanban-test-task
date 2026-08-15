import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';

export const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-white border border-neutral-300 p-8 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-neutral-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              404
            </span>
            <h1 className="text-lg font-bold font-mono tracking-tight text-neutral-900 uppercase">
              Page Not Found
            </h1>
          </div>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="px-3.5 py-2 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 transition-colors inline-block"
            >
              Back to Main Page
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
