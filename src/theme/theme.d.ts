
type IAppTheme =
  | typeof import('./theme-config').lightTheme
  | typeof import('./theme-config').darkTheme;

// Define supported theme selection options
type ISelectedTheme = 'light' | 'dark' | 'auto';

interface IAppThemeContext {
  currentTheme: IAppTheme;
  selectedThemeType: ISelectedTheme;
  setSelectedThemeType: (themeTypeProp: ISelectedTheme) => void;
  resetTheme: () => void;
}

interface IAppThemeProvider {
  autoDetect?: boolean;
  children: React.ReactNode;
}
