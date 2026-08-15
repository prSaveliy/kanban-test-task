import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, BoardPage, NotFoundPage, RootError } from '../pages';

const router = createBrowserRouter([
  {
    errorElement: <RootError />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/boards/:id',
        element: <BoardPage />,
      },
      {
        path: '/board/:id',
        element: <BoardPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
