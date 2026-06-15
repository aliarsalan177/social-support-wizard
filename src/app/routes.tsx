import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { Wizard } from '@/features/wizard';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      { index: true, element: <Navigate to="apply" replace /> },
      { path: 'apply', element: <Wizard /> },
      { path: 'apply/step/:step', element: <Navigate to="/apply" replace /> },
      { path: '*', element: <Navigate to="/apply" replace /> },
    ],
  },
];
