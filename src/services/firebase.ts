import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import {logger} from './logger';

class FirebaseService {
  async initialize() {
    try {
      // Enable crashlytics collection
      if (!__DEV__) {
        await crashlytics().setCrashlyticsCollectionEnabled(true);
      }

      // Request notification permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        logger.info('FCM Token', {token});
      }

      // Handle foreground messages
      messaging().onMessage(async (remoteMessage) => {
        logger.info('Foreground message received', remoteMessage);
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        logger.info('Background message received', remoteMessage);
      });

      logger.info('Firebase initialized successfully');
    } catch (error: any) {
      logger.error('Firebase initialization failed', error);
    }
  }

  // Analytics
  logEvent(eventName: string, parameters?: {[key: string]: any;}) {
    if (!__DEV__) {
      analytics().logEvent(eventName, parameters);
    }
    logger.info('Analytics Event', {eventName, parameters});
  }

  // Crashlytics
  recordError(error: Error) {
    if (!__DEV__) {
      crashlytics().recordError(error);
    }
    logger.error('Crashlytics Error', error);
  }
}

export const firebaseService = new FirebaseService();
