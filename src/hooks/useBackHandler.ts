import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useBackHandler = (handler: () => boolean) => {
  useEffect(() => {
    const backPressHandler = () => handler();

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backPressHandler,
    );

    return () => {
      subscription.remove();
    };
  }, [handler]);
};

export default useBackHandler;

/**
 * Usage:
 *
 * useBackHandler(() => {
 *   if (want_to_do_something) {
 *     // Do something
 *     return true; // Prevent default back action
 *   }
 *   return false; // Allow default back action
 * });
 */
