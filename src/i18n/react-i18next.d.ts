import 'i18next';
import {en, es, hi} from './resources';

/**
 * Extend the i18next namespace to include our custom types.
 *
 * This is necessary because i18next does not provide a way to extend the type
 * of the resources object. We have to manually declare the types for each
 * resource.
 *
 * @see https://github.com/i18next/i18next/issues/1701
 */
declare module 'i18next' {
  /**
   * Our custom type options.
   *
   * This is an extension of the i18next CustomTypeOptions interface.
   */
  interface CustomTypeOptions {
    /**
     * The default namespace.
     */
    defaultNS: 'en';
    /**
     * The resources object.
     *
     * This object contains the translations for each language.
     */
    resources: {
      /**
       * English translations.
       */
      en: typeof en;
      /**
       * Spanish translations.
       */
      es: typeof es;
      /**
       * Hindi translations.
       */
      hi: typeof hi;

      //! Add more languages here
    };
  }
}

/**
 * The type of a language.
 * It can be one of the supported languages ('en', 'es', 'hi') or 'auto' to use the device's language setting.
 */
declare global {
  //! Add your supported languages here.
  type ISelectedLangauge = 'auto' | 'en' | 'hi' | 'es';

  type IAppLocalizationContext = {
    currentLanguage: ISelectedLangauge; // Currently applied language
    selectedLanguageType: ISelectedLangauge; // Selected language preference (e.g., 'auto', 'en', 'fr')
    setSelectedLanguageType: (langParam: ISelectedLangauge) => void; // Setter function for updating selected language
    resetLanguage: () => void; // Function to reset language settings
  };
}
