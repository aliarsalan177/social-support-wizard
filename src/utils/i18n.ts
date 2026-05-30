import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../../locales/en.json'
import ar from '../../locales/ar.json'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type Language = typeof SUPPORTED_LANGUAGES[number]

/** RTL languages get `dir="rtl"`; everything else is LTR. */
export const RTL_LANGUAGES: readonly Language[] = ['ar']

export const dirFor = (lng: string): 'rtl' | 'ltr' =>
  RTL_LANGUAGES.includes(lng as Language) ? 'rtl' : 'ltr'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
