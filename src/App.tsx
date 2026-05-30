import { useRoutes } from 'react-router-dom';
import { AppLayout } from '@/app/app-layout';
import { routes } from '@/app/routes';


export default function App() {
  return (
    <AppLayout>
      {useRoutes(routes)}
    </AppLayout>
  );
}
