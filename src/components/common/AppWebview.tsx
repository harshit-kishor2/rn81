import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  BackHandler,
  ColorValue,
  Platform,
} from 'react-native';
import { WebView, WebViewProps, WebViewNavigation } from 'react-native-webview';
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewProgressEvent,
  WebViewMessageEvent,
  ShouldStartLoadRequest,
} from 'react-native-webview/lib/WebViewTypes';
import AppText from './AppText';
import AppButton from './AppButton';
import { useAppTheme } from '@app/theme/theme-provider';

interface IAppWebViewProps extends Omit<WebViewProps, 'source'> {
  // Core
  url: string;

  // Style
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  loadingColor?: ColorValue;
  backgroundColor?: ColorValue;

  // Loading
  showProgress?: boolean;
  customLoader?: React.ReactNode;
  loadingText?: string;

  // Errors
  onError?: (event: WebViewErrorEvent) => void;
  onHttpError?: (event: WebViewHttpErrorEvent) => void;
  showErrorScreen?: boolean;
  customErrorComponent?: React.ReactNode;
  retryEnabled?: boolean;

  // Navigation
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
  onShouldStartLoadWithRequest?: (event: ShouldStartLoadRequest) => boolean;
  enableBackButton?: boolean;

  // JavaScript
  injectedJavaScript?: string;
  onMessage?: (event: WebViewMessageEvent) => void;

  // Accessibility
  accessibilityLabel?: string;
  testID?: string;

  // Performance
  cacheEnabled?: boolean;
  textZoom?: number; // Android only
}

const AppWebview: React.FC<IAppWebViewProps> = ({
  url,

  // Style
  style,
  containerStyle,
  loadingColor,
  backgroundColor,

  // Loading
  showProgress = false,
  customLoader,
  loadingText,

  // Errors
  onError,
  onHttpError,
  showErrorScreen = true,
  customErrorComponent,
  retryEnabled = true,

  // Navigation
  onNavigationStateChange,
  onShouldStartLoadWithRequest,
  enableBackButton = true,

  // JS
  injectedJavaScript,
  onMessage,

  // Accessibility
  accessibilityLabel = 'Web content',
  testID,

  // Performance
  cacheEnabled = true,
  textZoom = 100,

  ...webViewProps
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const webViewRef = useRef<WebView>(null);
  const theme = useAppTheme();

  // ✅ validate URL
  const isValidUrl = useMemo(() => {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, [url]);

  // ✅ back button handling
  React.useEffect(() => {
    if (!enableBackButton) return;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [canGoBack, enableBackButton]);

  // ✅ load handlers
  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
    setProgress(0);
  }, []);
  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    setProgress(100);
  }, []);
  const handleLoadProgress = useCallback((e: WebViewProgressEvent) => {
    setProgress(e.nativeEvent.progress * 100);
  }, []);

  // ✅ nav state
  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
      setLoading(navState.loading);
      onNavigationStateChange?.(navState);
    },
    [onNavigationStateChange],
  );

  // ✅ shouldStartLoad (just forward to user if provided)
  const handleShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest) => {
      return onShouldStartLoadWithRequest?.(request) ?? true;
    },
    [onShouldStartLoadWithRequest],
  );

  // ✅ errors
  const handleError = useCallback(
    (syntheticEvent: WebViewErrorEvent) => {
      const { nativeEvent } = syntheticEvent;
      setLoading(false);
      setError(nativeEvent.description);
      onError?.(syntheticEvent);
    },
    [onError],
  );

  const handleHttpError = useCallback(
    (syntheticEvent: WebViewHttpErrorEvent) => {
      const { nativeEvent } = syntheticEvent;
      const msg = `HTTP Error: ${nativeEvent.statusCode} - ${nativeEvent.description}`;
      setError(msg);
      onHttpError?.(syntheticEvent);
    },
    [onHttpError],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  // ✅ render helpers
  const renderProgressBar = () =>
    showProgress && loading && progress < 100 ? (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: loadingColor || theme.colors.primary,
            },
          ]}
        />
      </View>
    ) : null;

  const renderLoader = () => {
    if (loading) {
      if (customLoader) {
        return <View style={styles.customLoaderContainer}>{customLoader}</View>;
      }
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={loadingColor || theme.colors.primary}
          />
          {loadingText && (
            <AppText
              style={[styles.loadingText, { color: theme.colors.text.primary }]}
            >
              {loadingText}
            </AppText>
          )}
        </View>
      );
    }
    return null;
  };
  const renderErrorScreen = () => {
    if (error && showErrorScreen) {
      if (customErrorComponent) {
        return (
          <View style={styles.errorContainer}>{customErrorComponent}</View>
        );
      }
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <AppText
              variant="h6"
              style={[styles.errorTitle, { color: theme.colors.text.primary }]}
            >
              Unable to Load Page
            </AppText>
            <AppText
              style={[
                styles.errorMessage,
                { color: theme.colors.text.secondary },
              ]}
              numberOfLines={3}
            >
              {error}
            </AppText>
            {retryEnabled && (
              <AppButton
                title="Try Again"
                onPress={handleRetry}
                size="medium"
                variant="outline"
                buttonContainerStyle={styles.retryButton}
              />
            )}
          </View>
        </View>
      );
    }
  };

  // ✅ invalid URL
  if (!isValidUrl) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.errorContainer}>
          <AppText style={{ color: theme.colors.text.primary }}>
            Invalid URL provided
          </AppText>
        </View>
      </View>
    );
  }

  // ✅ render
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {renderProgressBar()}

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={[
          styles.webview,
          { backgroundColor: backgroundColor || 'transparent' },
          style,
        ]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={showProgress ? handleLoadProgress : undefined}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={handleError}
        onHttpError={handleHttpError}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        pullToRefreshEnabled
        allowsBackForwardNavigationGestures
        scalesPageToFit
        allowFileAccess
        originWhitelist={['*']}
        javaScriptCanOpenWindowsAutomatically
        cacheEnabled={cacheEnabled}
        accessibilityLabel={accessibilityLabel}
        testID={testID ? `${testID}-webview` : undefined}
        {...(Platform.OS === 'android' ? { textZoom } : {})}
        {...webViewProps}
      />

      {!error && renderLoader()}
      {renderErrorScreen()}
    </View>
  );
};

AppWebview.displayName = 'AppWebview';
export default AppWebview;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressBar: { height: '100%', backgroundColor: '#007AFF' },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  customLoaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 16, fontSize: 16 },
  errorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
  },
  errorContent: { alignItems: 'center', maxWidth: 300 },
  errorTitle: { textAlign: 'center', marginBottom: 12 },
  errorMessage: { textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  retryButton: { minWidth: 120 },
});

/*

<AppWebview
        url="https://reactnative.dev"
        loadingColor="#2563EB"
        backgroundColor="#F9FAFB"
        showProgress
        loadingText="Loading website..."
        onError={(description, code) => {
          console.log('Webview error:', description, code);
        }}
        onHttpError={(description, statusCode) => {
          console.log('HTTP error:', description, statusCode);
        }}
        onNavigationStateChange={(navState) => {
          console.log('Navigation state:', navState.url);
        }}
        onMessage={(event) => {
          console.log('Message from webview:', event.nativeEvent.data);
        }}
        injectedJavaScript={`
          setTimeout(() => {
            window.ReactNativeWebView.postMessage("Hello from inside the WebView!");
          }, 2000);
          true;
        `}
      />.

*/
