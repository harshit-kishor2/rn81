import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {I18nextProvider, useTranslation} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import i18n, {
  APP_LANGUAGE_TYPE_KEY,
  appLanguageLocalStorage,
  seti18nLanguage,
} from './i18n-config';

export const AppLocalizationContext = createContext<
  IAppLocalizationContext | undefined
>(undefined);

export const useAppTranslation = () => {
  const {t: translate} = useTranslation();
  return translate;
};

export const useAppLocalizationContext = () => {
  const context = useContext(AppLocalizationContext);
  if (!context)
    throw Error(
      'useAppLocalizationContext must be used inside AppLocalizationProvider',
    );
  return context;
};

export const AppLocalizationProvider = ({
  autoDetect = true,
  defaultLanguage = 'en',
  children,
}: React.PropsWithChildren<{
  autoDetect?: boolean;
  defaultLanguage?: string;
}>) => {
  const deviceLang = getLocales()[0].languageCode;

  const [selectedLanguageType, setSelectedLanguageType] =
    useState<ISelectedLangauge>('auto');

  useEffect(() => {
    const initializeLanguage = () => {
      try {
        const savedLangType = appLanguageLocalStorage.getString(
          APP_LANGUAGE_TYPE_KEY,
        ) as ISelectedLangauge;
        setSelectedLanguageType(savedLangType ?? 'auto');
      } catch (error) {
        console.error('Error loading language from storage:', error);
        setSelectedLanguageType('auto');
      }
    };
    initializeLanguage();
  }, []);

  useEffect(() => {
    try {
      appLanguageLocalStorage.set(APP_LANGUAGE_TYPE_KEY, selectedLanguageType);
      if (selectedLanguageType === 'auto') {
        seti18nLanguage(autoDetect ? deviceLang : defaultLanguage);
      } else {
        seti18nLanguage(selectedLanguageType);
      }
    } catch (error) {
      console.error(
        'Error saving language to storage or updating i18n:',
        error,
      );
    }
  }, [selectedLanguageType, deviceLang, autoDetect, defaultLanguage]);

  const resetLanguage = useCallback(() => {
    try {
      appLanguageLocalStorage.delete(APP_LANGUAGE_TYPE_KEY);
      setSelectedLanguageType('auto');
      seti18nLanguage(autoDetect ? deviceLang : defaultLanguage);
    } catch (error) {
      console.error('Error reseting language settings:', error);
    }
  }, [autoDetect, deviceLang, defaultLanguage]);

  const appliedLanguage = useMemo(() => {
    if (selectedLanguageType === 'auto') {
      return autoDetect
        ? (deviceLang as ISelectedLangauge)
        : (defaultLanguage as ISelectedLangauge);
    }
    return selectedLanguageType;
  }, [selectedLanguageType, deviceLang, autoDetect, defaultLanguage]);

  const value: IAppLocalizationContext = useMemo(
    () => ({
      currentLanguage: appliedLanguage,
      selectedLanguageType,
      setSelectedLanguageType,
      resetLanguage,
    }),
    [appliedLanguage, resetLanguage, selectedLanguageType],
  );

  return (
    <I18nextProvider i18n={i18n}>
      <AppLocalizationContext.Provider value={value}>
        {children}
      </AppLocalizationContext.Provider>
    </I18nextProvider>
  );
};
