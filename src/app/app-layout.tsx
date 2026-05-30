import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/language-toggle';

function AppHeader() {
  const { t } = useTranslation();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <div className="text-start">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {t('app.title')}
          </h1>
          <p className="text-sm text-slate-500">{t('app.subtitle')}</p>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}

/**
 * App chrome: predefined header + main wrapper. The routed element is
 * passed in as `children`, keeping App itself a thin composition root.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
