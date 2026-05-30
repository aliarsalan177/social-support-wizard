import 'i18next';
import type en from '../../locales/en.json';

// Gives us autocomplete + type-checking on every t('…') key,
// derived from the English locale file (the source of truth for keys).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}
