import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type UseAppStateOptions = {
  onAppActive?: () => void;
  onAppBackground?: () => void;
  onAppInactive?: () => void;
};

/**
 * A hook that listens for changes in the app state and triggers callbacks when the app state changes.
 *
 * The hook takes an object with three optional properties:
 * - `onAppActive`: a callback that is called when the app becomes active.
 * - `onAppBackground`: a callback that is called when the app goes into the background.
 * - `onAppInactive`: a callback that is called when the app becomes inactive.
 *
 * The hook returns the current app state, which can be one of the following values:
 * - 'active': the app is in the foreground.
 * - 'background': the app is in the background.
 * - 'inactive': the app is in an inactive state (e.g. when the app is minimized).
 *
 * The hook will automatically remove the AppState event listener when it is unmounted.
 *
 * @example
 * const MyComponent = () => {
 *   const appState = useAppState({
 *     onAppActive: () => console.log('App is active'),
 *     onAppBackground: () => console.log('App is in background'),
 *     onAppInactive: () => console.log('App is inactive'),
 *   });
 *
 *   return <Text>Current App State: {appState}</Text>;
 * };
 *
 * @param options an object with the callbacks to be called when the app state changes.
 * @returns the current app state.
 */
const useAppState = ({
  onAppActive,
  onAppBackground,
  onAppInactive,
}: UseAppStateOptions = {}) => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const appStateRef = useRef(appState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const prevAppState = appStateRef.current;

      if (
        (prevAppState === 'inactive' || prevAppState === 'background') &&
        nextAppState === 'active'
      ) {
        onAppActive?.();
      }

      if (
        (prevAppState === 'active' || prevAppState === 'inactive') &&
        nextAppState === 'background'
      ) {
        onAppBackground?.();
      }

      if (
        (prevAppState === 'active' || prevAppState === 'background') &&
        nextAppState === 'inactive'
      ) {
        onAppInactive?.();
      }

      appStateRef.current = nextAppState;
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, [onAppActive, onAppBackground, onAppInactive]);

  return appState;
};
export default useAppState;
