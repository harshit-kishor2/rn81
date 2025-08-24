import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {darkTheme, lightTheme} from './theme-config';

const APP_THEME_LOCAL_STORAGE_KEY = '@app_theme_type';
const APP_THEME_LOCAL_STORAGE_ID = 'app-theme-local-storage-id';
const APP_THEME_LOCAL_STORAGE_ENCRYPTION_KEY = 'secure-random-encryption-key';

export const appThemeLocalStorage: MMKV = new MMKV({
  id: APP_THEME_LOCAL_STORAGE_ID,
  encryptionKey: APP_THEME_LOCAL_STORAGE_ENCRYPTION_KEY,
});

export const AppThemeContext = createContext<IAppThemeContext | undefined>(
  undefined,
);

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error(
      'useAppTheme must be used within AppThemeProvider. Make sure you have wrapped your app with AppThemeProvider.',
    );
  }
  return context.currentTheme;
};

export const useAppThemeContext = (): IAppThemeContext => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error(
      'useAppThemeContext must be used within AppThemeProvider. ' +
        'Make sure you have wrapped your app with AppThemeProvider.',
    );
  }
  return context;
};

export const AppThemeProvider = ({
  autoDetect = true,
  children,
}: IAppThemeProvider) => {
  const [deviceTheme, setDeviceTheme] = useState<ISelectedTheme>('light');

  const [selectedThemeType, setSelectedThemeType] =
    useState<ISelectedTheme>('auto');

  useEffect(() => {
    const updateDeviceTheme = () => {
      const systemTheme = Appearance.getColorScheme() ?? 'light';
      setDeviceTheme(systemTheme);
    };
    const listener = Appearance.addChangeListener(updateDeviceTheme);
    updateDeviceTheme(); // Initialize deviceTheme on mount
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const loadThemePreference = () => {
      try {
        const savedTheme = appThemeLocalStorage.getString(
          APP_THEME_LOCAL_STORAGE_KEY,
        ) as ISelectedTheme;

        if (['auto', 'dark', 'light'].includes(savedTheme)) {
          setSelectedThemeType(savedTheme);
        } else {
          setSelectedThemeType('auto');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setSelectedThemeType('auto');
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    try {
      appThemeLocalStorage.set(APP_THEME_LOCAL_STORAGE_KEY, selectedThemeType);
    } catch (error) {
      console.error('Error saving theme to storage or updating theme:', error);
    }
  }, [selectedThemeType]);

  const resetTheme = () => {
    try {
      appThemeLocalStorage.delete(APP_THEME_LOCAL_STORAGE_KEY);
      setSelectedThemeType('auto'); // Reset to default
    } catch (error) {
      console.error('Error clearing theme preferences:', error);
    }
  };

  // Compute applied theme
  const appliedTheme = useMemo(() => {
    const isAutoDetected = selectedThemeType === 'auto' && autoDetect;
    const themeToApply = isAutoDetected ? deviceTheme : selectedThemeType;
    return themeToApply === 'dark' ? darkTheme : lightTheme;
  }, [selectedThemeType, deviceTheme, autoDetect]);

  const value = useMemo(
    () => ({
      currentTheme: appliedTheme,
      setSelectedThemeType,
      selectedThemeType,
      resetTheme,
    }),
    [appliedTheme, selectedThemeType],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};
