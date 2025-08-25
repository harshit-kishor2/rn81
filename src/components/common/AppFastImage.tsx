import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  ActivityIndicator,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ColorValue,
} from 'react-native';
import FastImage, {
  FastImageProps as FastImageProp,
  ImageStyle,
  Priority,
  Source,
  OnLoadEvent,
  OnProgressEvent,
} from '@d11/react-native-fast-image';

export type FastImageProps = Omit<FastImageProp, 'source'>;

export interface ImageProps extends FastImageProps {
  // Container and styling
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;

  // Image source and priority
  source?: string | Source | number;
  fallbackSource?: Source | number;
  priority?: Priority;

  // Loading and uploading states
  uploading?: boolean;
  showIndicator?: boolean;
  indicatorSize?: number | 'small' | 'large';
  loaderColor?: ColorValue;

  // Progress tracking
  showProgress?: boolean;
  onProgress?: (event: OnProgressEvent) => void;

  // Error handling
  onError?: (error?: any) => void;
  onLoadEnd?: (event?: OnLoadEvent) => void;
  onLoadStart?: () => void;

  // Additional props
  children?: React.ReactNode;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;

  // Custom loading component
  customLoader?: React.ReactNode;

  // Retry functionality
  maxRetries?: number;
  retryDelay?: number;
}

const AppFastImage: React.FC<ImageProps> = ({
  // Container and styling
  containerStyle,
  style,

  // Image source and priority
  source,
  fallbackSource,
  priority = FastImage.priority.normal,

  // Loading and uploading states
  uploading = false,
  showIndicator = true,
  indicatorSize = 20,
  loaderColor,

  // Progress tracking
  showProgress = false,
  onProgress,

  // Error handling
  onError,
  onLoadEnd,
  onLoadStart,

  // Additional props
  children,
  testID,
  accessible,
  accessibilityLabel,

  // Custom loading component
  customLoader,

  // Retry functionality
  maxRetries = 3,
  retryDelay = 1000,

  // FastImage props
  resizeMode = FastImage.resizeMode.contain,
  ...rest
}) => {
  const [loading, setLoading] = useState<boolean>(uploading);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [imageSource, setImageSource] = useState<number | Source | undefined>();
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Memoize source resolution to avoid unnecessary re-calculations
  const resolvedSource = useMemo(() => {
    if (!source) return undefined;

    if (typeof source === 'string') {
      return { uri: source, priority };
    }
    if (typeof source === 'object' && source?.uri) {
      return { ...source, priority };
    }
    if (typeof source === 'number') {
      return source;
    }
    return undefined;
  }, [source, priority]);

  // Set initial image source
  useEffect(() => {
    setImageSource(resolvedSource);
    setLoadError(false);
    setRetryCount(0);
    setProgress(0);
  }, [resolvedSource]);

  // Handle uploading state changes
  useEffect(() => {
    if (typeof uploading === 'boolean') {
      setLoading(uploading);
    }
  }, [uploading]);

  // Retry logic with exponential backoff
  const retryLoad = useCallback(() => {
    if (retryCount < maxRetries && resolvedSource) {
      const delay = retryDelay * Math.pow(2, retryCount);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setLoadError(false);
        setLoading(true);
        setImageSource(resolvedSource);
      }, delay);
    }
  }, [retryCount, maxRetries, retryDelay, resolvedSource]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const newLayout = e.nativeEvent.layout;
    setLayout(prevLayout => {
      if (
        !prevLayout ||
        prevLayout.x !== newLayout.x ||
        prevLayout.y !== newLayout.y ||
        prevLayout.width !== newLayout.width ||
        prevLayout.height !== newLayout.height
      ) {
        return newLayout;
      }
      return prevLayout;
    });
  }, []);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    setProgress(0);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadEnd = useCallback(
    (event?: OnLoadEvent) => {
      setLoading(false);
      setProgress(100);
      onLoadEnd?.(event);
    },
    [onLoadEnd],
  );

  const handleError = useCallback(
    (error?: any) => {
      setLoading(false);
      setLoadError(true);

      // Try fallback source first
      if (fallbackSource && imageSource !== fallbackSource) {
        setImageSource(fallbackSource);
        return;
      }

      // Then try retry logic
      if (retryCount < maxRetries) {
        retryLoad();
        return;
      }

      // Finally call error callback
      onError?.(error);
    },
    [fallbackSource, imageSource, retryCount, maxRetries, retryLoad, onError],
  );

  const handleProgress = useCallback(
    (event: OnProgressEvent) => {
      const progressPercent =
        (event.nativeEvent.loaded / event.nativeEvent.total) * 100;
      setProgress(progressPercent);
      onProgress?.(event);
    },
    [onProgress],
  );

  // Determine if we should show loading indicator
  const shouldShowIndicator = useMemo(() => {
    return (
      showIndicator &&
      loading &&
      !loadError &&
      typeof source === 'string' &&
      source.startsWith('http')
    );
  }, [showIndicator, loading, loadError, source]);

  // Merge styles properly
  const mergedStyle: StyleProp<ImageStyle> = useMemo(
    () => [
      style,
      // Only apply layout if style has flex property and layout is available
      (style as any)?.flex && layout
        ? {
            width: layout.width,
            height: layout.height,
          }
        : undefined,
    ],
    [style, layout],
  );

  // Don't render if no valid source
  if (!imageSource) {
    return null;
  }

  const renderLoader = () => {
    if (customLoader) {
      return customLoader;
    }

    return (
      <View style={styles.indicator}>
        <ActivityIndicator
          color={loaderColor || '#666666'}
          size={indicatorSize}
          animating={true}
          testID={testID ? `${testID}-loader` : undefined}
        />
        {showProgress && progress > 0 && progress < 100 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={handleLayout}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
    >
      <FastImage
        style={mergedStyle}
        source={imageSource}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onProgress={showProgress ? handleProgress : undefined}
        {...rest}
      >
        {children}
      </FastImage>

      {shouldShowIndicator && renderLoader()}

      {loadError && retryCount >= maxRetries && (
        <View
          style={styles.errorContainer}
          testID={testID ? `${testID}-error` : undefined}
        >
          <View style={styles.errorContent}>
            {/* You can customize error display here */}
          </View>
        </View>
      )}
    </View>
  );
};

AppFastImage.displayName = 'AppFastImage';

export default AppFastImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorContent: {
    // Add your error styling here
  },
});

// Usage Examples:

// 1. Basic Remote Image with Loading Indicator
/* <AppFastImage
  source="https://example.com/image.jpg"
  style={{width: 100, height: 100, borderRadius: 8}}
  containerStyle={{margin: 10}}
  loaderColor="#007AFF"
  indicatorSize={30}
  showIndicator
  testID="remote-image"
/> */

// 2. Local Static Image
/* <AppFastImage
  source={require('./assets/local-image.png')}
  style={{width: 100, height: 100}}
  containerStyle={{margin: 10}}
  testID="local-image"
/> */

// 3. Remote Image with Fallback and Progress
/* <AppFastImage
  source="https://example.com/maybe-broken.jpg"
  fallbackSource={require('./assets/fallback.png')}
  style={{width: 100, height: 100}}
  loaderColor="#00FF00"
  showIndicator
  showProgress
  maxRetries={5}
  retryDelay={2000}
  onProgress={(event) => console.log('Progress:', event.nativeEvent.loaded / event.nativeEvent.total)}
  testID="fallback-image"
/> */

// 4. Uploading State with Custom Loader
/* <AppFastImage
  source="https://example.com/uploading.jpg"
  uploading={true}
  style={{width: 100, height: 100}}
  customLoader={
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={{color: 'white', fontSize: 12, marginTop: 8}}>Uploading...</Text>
    </View>
  }
  testID="upload-image"
>
  <View style={{position: 'absolute', bottom: 8, left: 8}}>
    <Text style={{color: 'white', fontSize: 10}}>Processing...</Text>
  </View>
</AppFastImage> */
