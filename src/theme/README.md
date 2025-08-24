# React Native Theme Module

This module provides a customizable theme management solution for React Native applications. It allows apps to easily switch between light and dark themes and supports automatic detection of the system's theme preference.

##### Features

- **Auto Detect Theme:** Automatically detects and applies the system theme (light/dark).
- **Light/Dark Theme Toggle:** Allows users to choose between light and dark themes.
- **Theme Persistence:** Saves the selected theme in local storage, so it persists across app restarts.
- **Customization:** Easily extendable for custom themes or additional configurations.

---

## Table of Contents

- [Installation](#installation)
- [Setup and Usage](#setup-and-usage)
- [File Structure](#file-structure)
- [Conclusion](#conclusion)

---

## Installation

Follow these steps to install and configure the theme system in your app.

**Copy the `theme` Module**

- Copy the theme folder (containing all the files) to your project.

## Setup and Usage

After adding the theme module to your project, follow these steps:

#### . Wrap Your App with AppThemeProvider

In your App.tsx (or main entry file), wrap your app with the `AppThemeProvider` to enable theme context throughout your app
`AppThemeProvider` is the top-level component responsible for initializing theme and setting up theme context. You can optionally enable auto-detection of the device's theme.

**Props:**

- autoDetect (boolean, default: true): If `true`, it will automatically detect the device's theme setting. Otherwise, it will use the user's selected theme preference.

Example usage:

```javascript
import {AppThemeProvider} from '@theme/theme-provider'; // Path to your theme module

const App = () => (
  <AppThemeProvider autoDetect={true}>
    {/* Your app's components */}
  </AppThemeProvider>
);
```

#### 2. Change your app theme

The `useAppThemeContext` hook provides access to the current theme and allows you to switch between light, dark, or custom themes.

```javascript
const {currentTheme, setSelectedThemeType, selectedThemeType} =
  useAppThemeContext();
```

- **currentTheme**: Returns the current theme object (colors, typography, etc.).
- **setSelectedThemeType(themeType: 'light' | 'dark' | 'auto'):** Sets the theme type.
- **selectedThemeType:** Returns the current theme type ('light', 'dark', or 'auto').
- **resetTheme:** Reset theme

#### 3. Usage of Theme

The useAppTheme hook provides the theme object.

```javascript
import {useAppTheme} from '@theme/theme-provider';

const MyComponent = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => homeScreenStyles(theme), [theme]);

  return <View style={styles.container} />;
};

const homeScreenStyles = (theme: IAppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.red,
    },
  });
```

### How to Customize Theme

- Update `theme-config.ts` file according to your theme colors.
- You can add random properties also inside your theme. If you have added custom properties then you have to also update types in `theme.d.ts` file.

## File Structure

The folder structure is organized to facilitate easy management and customization of the theme:

```graphql
theme/
│
├── theme-provider.tsx    # Context provider to manage theme selection
├── theme.d.ts              # TypeScript definitions for theme types
└── theme-config.ts               # Light and dark theme definitions
```

## Conclusion

This theme module provides a simple and flexible way to manage theming in your React Native app, with support for both light and dark modes, custom theme options, and automatic system detection. By utilizing the AppThemeProvider and useAppThemeContext, you can easily manage and switch themes across your app.
