import {AppLocalizationProvider} from '@app/i18n/i18n-provider';
import {persistor, reduxStore} from '@app/store';
import {AppThemeProvider} from '@app/theme/theme-provider';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxStoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

type PropsWithChildren = {
  children: React.ReactNode;
};

//! All Global Context Providers Composition (AppThemeProvider, AppLocalizationProvider)
const GlobalContextProviders = ({children}: PropsWithChildren) => (
  <ReduxStoreProvider store={reduxStore}>
    <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
      <AppThemeProvider autoDetect>
        <AppLocalizationProvider defaultLanguage="en">
          {children}
        </AppLocalizationProvider>
      </AppThemeProvider>
    </PersistGate>
  </ReduxStoreProvider>

);


//! Layout Providers Composition
const LayoutProviders = ({children}: PropsWithChildren) => (
  <GestureHandlerRootView style={styles.container}>
    <SafeAreaProvider style={styles.container}>
      <KeyboardProvider statusBarTranslucent>
        {children}
      </KeyboardProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

//! Core Providers Composition (PortalProvider,BottomSheetModalProvider, ToastProvider, ErrorBoundary)
const CoreProviders = ({children}: PropsWithChildren) => (
  <>
    <>{children}</>
  </>
);


//! Root Wrapper Component with all Providers
const RootWrapper = ({children}: PropsWithChildren) => (
  <GlobalContextProviders>
    <LayoutProviders>
      <CoreProviders>
        {children}
      </CoreProviders>
    </LayoutProviders>
  </GlobalContextProviders>
);

export default RootWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
