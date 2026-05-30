import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { dirFor } from '@/utils/i18n';

/**
 * Keeps the document's `lang` and `dir` attributes in sync with the
 * active language so the whole UI mirrors correctly for Arabic (RTL).
 */
export function DirectionProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = i18n.language;
    root.dir = dirFor(i18n.language);
  }, [i18n.language]);

  return <>{children}</>;
}
