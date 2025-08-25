import { useEffect } from 'react';
import { Alert } from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

/**
 * A hook that sets up exception handlers for React Native applications.
 * It provides a way to handle JavaScript and native exceptions in a consistent manner.
 * @property {((error: Error, isFatal: boolean) => void) | undefined} onJSError - A custom error handler for JavaScript errors.
 * @property {((exceptionString: string) => void) | undefined} onNativeError - A custom error handler for native errors.
 * @property {boolean} [showAlert=true] - Whether to show an alert when an error occurs.
 * @returns {void}
 * @example
 * useExceptionHandler({
 *   onJSError: (error, isFatal) => {
 *     // Handle JavaScript errors here
 *   },
 *   onNativeError: (exceptionString) => {
 *     // Handle native errors here
 *   },
 *   showAlert: true, // Show alert for errors
 * })
 *
 */

const useExceptionHandler = ({
  onJSError,
  onNativeError,
  showAlert = false,
}: UseExceptionHandlerOptions = {}): void => {
  useEffect(() => {
    const handleJSError = (error: Error, isFatal: boolean) => {
      // Log the error
      console.log('Caught JS Exception:', error, 'isFatal:', isFatal);

      // Call custom error handler if provided
      onJSError?.(error, isFatal);

      // Show alert if enabled
      if (showAlert) {
        Alert.alert(
          'Unexpected Error Occurred',
          `Error: ${isFatal ? 'Fatal:' : ''} ${error.name} ${error.message}`,
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    };

    const handleNativeError = (exceptionString: string) => {
      // Log the native error
      console.log('Caught Native Exception:', exceptionString);

      // Call custom native error handler if provided
      onNativeError?.(exceptionString);
    };

    // Set up JS exception handler
    setJSExceptionHandler(handleJSError, true);

    // Set up native exception handler
    setNativeExceptionHandler(handleNativeError, false, true);

    // Cleanup function (optional, but good practice)
    return () => {
      // Reset handlers to default if needed
      setJSExceptionHandler(() => {}, true);
      setNativeExceptionHandler(() => {}, false, true);
    };
  }, [onJSError, onNativeError, showAlert]);
};

export default useExceptionHandler;

interface UseExceptionHandlerOptions {
  /**
   * A custom error handler for JavaScript errors.
   */
  onJSError?: (error: Error, isFatal: boolean) => void;
  /**
   * A custom error handler for native errors.
   */
  onNativeError?: (exceptionString: string) => void;
  /**
   * Whether to show an alert when an error occurs.
   */
  showAlert?: boolean;
}
