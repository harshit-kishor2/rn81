import {logger as rnLogger, consoleTransport} from 'react-native-logs';
import crashlytics from '@react-native-firebase/crashlytics';

interface LogData {
  [key: string]: any;
}

class Logger {
  private readonly logger = rnLogger.createLogger({
    severity: __DEV__ ? 'debug' : 'error',
    transport: __DEV__ ? consoleTransport : undefined,
  });

  info(message: string, data?: LogData) {
    this.logger.info(message, data);
    if (!__DEV__) {
      crashlytics().log(`INFO: ${message} - ${JSON.stringify(data || {})}`);
    }
  }

  warn(message: string, data?: LogData) {
    this.logger.warn(message, data);
    if (!__DEV__) {
      crashlytics().log(`WARN: ${message} - ${JSON.stringify(data || {})}`);
    }
  }

  error(message: string, error?: Error | LogData) {
    this.logger.error(message, error);
    if (!__DEV__) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      crashlytics().log(`ERROR: ${message} - ${JSON.stringify(error || {})}`);
    }
  }

  debug(message: string, data?: LogData) {
    if (__DEV__) {
      this.logger.debug(message, data);
    }
  }
}

export const logger = new Logger();
