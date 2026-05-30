import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@/utils/i18n';
import { DirectionProvider } from '@/app/providers/direction-provider';
import App from './App.tsx';

/** In dev, route the mock submit API through MSW so there's no real backend. */
async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <DirectionProvider>
          <App />
        </DirectionProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
