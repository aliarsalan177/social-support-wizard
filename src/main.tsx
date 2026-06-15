import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@/utils/i18n';
import { setupFormwright } from '@/features/wizard/formwright-setup';
import { DirectionProvider } from '@/app/providers/direction-provider';
import { captureOpenAiKeyFromUrl } from '@/utils/openai-key';
import App from '@/App';

setupFormwright();

// Pick up an OpenAI key passed as ?open-ai-key=... (10-min TTL) before render.
captureOpenAiKeyFromUrl();

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
