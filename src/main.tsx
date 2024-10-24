import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Edit from './routes/edit.tsx';
import Profile from './routes/profile.tsx';
import View from './routes/view.tsx';
import Layout from './components/Layout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Render the Layout component
    children: [
      { path: '/edit', element: <Edit /> },
      { path: '/profile', element: <Profile /> },
      { path: '/view', element: <View /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
