import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';

import dayjs from 'dayjs';
import {MMKV} from 'react-native-mmkv';

import {default as en} from './resources/en.json';
import {default as hi} from './resources//hi.json';
import {default as es} from './resources//es.json';

// dayjs locales for i18n
// Keep this list in sync with the locales in src/i18n/resources
// See https://github.com/iamkun/dayjs/tree/dev/src/locale
import 'dayjs/locale/en-gb';
import 'dayjs/locale/hi';
import 'dayjs/locale/es';

export const DEFAULT_LANGUAGE = 'en';

export const APP_LANGUAGE_TYPE_KEY = '@app_language_type';
export const APP_LANGUAGE_KEY = '@app_language';

export const appLanguageLocalStorage: MMKV = new MMKV();

export const seti18nLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    dayjs.locale(lang);
    appLanguageLocalStorage.set(APP_LANGUAGE_KEY, lang);
  } catch (error) {
    console.error('Error setting language:', error);
  }
};

/**
 * A language detector that stores the user's selected language in local storage.
 *
 * When the user selects a language, it is stored in local storage using the key specified in appLanguageLocalStorageKeys.app_language.
 * The detect method is called when the app starts, and it checks if a language is stored in local storage.
 * If a language is stored, it is returned as the user's selected language.
 * If no language is stored, the method returns null.
 *
 * When the user changes their language preference, the cacheUserLanguage method is called to store the new language in local storage.
 *
 * @type {LanguageDetectorAsyncModule}
 */
const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (lng: string) => void) => {
    const savedLanguage = appLanguageLocalStorage.getString(APP_LANGUAGE_KEY);
    callback(savedLanguage || DEFAULT_LANGUAGE);
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    appLanguageLocalStorage.set(APP_LANGUAGE_KEY, lng);
  },
};

/**
 * Initialize the i18next instance with the necessary settings.
 *
 * @see https://www.i18next.com/overview/configuration-options
 */
i18n
  .use(languageDetector) // Use the language storage detector
  .use(initReactI18next) // Use the react-i18next plugin
  .init({
    resources: {
      en: {translation: en},
      hi: {translation: hi},
      es: {translation: es},
      //! Add more languages here
    },
    fallbackLng: DEFAULT_LANGUAGE, // The default language to fall back to if a translation is not found.
    lng: DEFAULT_LANGUAGE, // The default language to initialize the i18next instance with.
    debug: __DEV__,
    interpolation: {
      escapeValue: false, // Whether to escape values when interpolating.
    },
    react: {
      useSuspense: false, // Whether to use the Suspense feature of React.
    },
  });

export default i18n;
