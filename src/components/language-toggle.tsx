import { useTranslation } from 'react-i18next';
import type { Language } from '@/utils/i18n';

/** Single button that flips between English and Arabic. */
export function LanguageToggle() {
  const { t, i18n } = useTranslation();

  const toggle = () => {
    const next: Language = i18n.language.startsWith('ar') ? 'en' : 'ar';
    void i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {t('app.languageLabel')}
    </button>
  );
}
