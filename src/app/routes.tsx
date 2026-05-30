import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { Wizard } from '@/features/wizard';

/**
 * Route configuration as a plain object tree (the modern React Router way),
 * consumed via `useRoutes` in App. Defined at module scope so the array is a
 * stable reference — no memoization needed.
 */

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Navigate to="apply/step/1" replace />,
      },
      {
        path: 'apply/step/:step',
        element: <Wizard />,
      },
      {
        path: '*',
        element: <Navigate to="/apply/step/1" replace />,
      },
    ],
  },
];