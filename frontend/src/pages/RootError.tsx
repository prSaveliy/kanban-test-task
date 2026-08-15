import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Layout } from '../components/layout';

export const RootError = () => {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-white border border-neutral-300 p-8 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-neutral-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-red-600">
              Application Error
            </span>
            <h1 className="text-lg font-bold font-mono tracking-tight text-neutral-900 uppercase">
              Something went wrong
            </h1>
          </div>
          <p className="text-xs font-mono text-neutral-600 bg-neutral-50 p-3 border border-neutral-200 break-words">
            {errorMessage}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="px-3.5 py-2 text-xs font-mono tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 transition-colors inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
