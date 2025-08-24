import STRINGS from '@app/constants/strings';
import {logger} from '@app/services/logger';
import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import {MMKV} from 'react-native-mmkv';
import ENDPOINTS from './endpoints';

export const apiTokenLocalStorage = new MMKV({
  id: 'api-token-local-storage-id',
  encryptionKey: 'my-random-key-for-encryption',
});

// Create Axios Instance
const apiClient = axios.create({
  baseURL: STRINGS.API_BASE_URL,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logger for axios
apiClient.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

apiClient.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

// Request Interceptor
apiClient.interceptors.request.use(
  config => {
    const accessToken = apiTokenLocalStorage.getString('access_token');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // logger.info('API Request:', config)
    return config;
  },
  error => {
    logger.error('Request Error: ', error);
    return Promise.reject(new Error(error.message));
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  response => {
    // logger.info('API Response:', response)
    return response;
  }, // Pass successful responses
  async error => {
    if (error.response) {
      const originalRequest = error.config;
      const {status} = error.response;
      if (status === 401 && !originalRequest._retry) {
        // Attempt to refresh token
        originalRequest._retry = true;
        const newAccessToken = await refreshTokens();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest); // Retry the original request
        } else {
          // Logout if token refresh fails and redirect to LoginScreen
          handleLogout();
        }
      } else {
        // Handle other status codes
        handleApiError(error);
      }
    } else if (error.request) {
      logger.error('No Response from Server: ', error.request);
      logger.error('Network Error: Please check your internet connection.');
    } else {
      logger.error('Request Setup Error: ', error.message);
      logger.error('Error: An unexpected error occurred.');
    }
    return Promise.reject(new Error(error.message));
  }
);

// Global Error Handler Function
const handleApiError = (error: any) => {
  const {status, data} = error.response;
  const errorMessage = data?.message || 'An unexpected error occurred.';
  switch (status) {
    case 400:
      logger.error('Bad Request: ', errorMessage);
      break;
    case 401:
      logger.error('Unauthorized: Please log in again.');
      handleLogout();
      break;
    case 403:
      logger.error('Forbidden: You do not have access to this resource.');
      break;
    case 404:
      logger.error('Not Found: The requested resource could not be found.');
      break;
    case 500:
      logger.error('Server Error: An internal server error occurred.');
      break;
    default:
      logger.error('Default Error: ', errorMessage);
  }
};

// Refresh Token Logic
const refreshTokens = async (): Promise<string | null> => {
  try {
    const refreshToken = apiTokenLocalStorage.getString('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available.');
    }
    const response = await axios.post(ENDPOINTS.REFRESH_TOKEN_PATH, {
      refreshToken,
    });
    const {accessToken, refresh_token: newRefreshToken} = response.data;
    apiTokenLocalStorage.set('refresh_token', newRefreshToken);
    apiTokenLocalStorage.set('access_token', accessToken);
    return accessToken;
  } catch (error) {
    apiTokenLocalStorage.delete('access_token');
    apiTokenLocalStorage.delete('refresh_token');
    logger.error('Token Refresh Error:', error as Error);
    return null;
  }
};

// Logout Logic
export const handleLogout = () => {
  try {
    apiTokenLocalStorage.delete('access_token');
    apiTokenLocalStorage.delete('refresh_token');
    logger.debug('Logout successful and data cleared.');
    // Clear all stored data
    // Navigate to LoginScreen or restart the app
    // e.g., resetAndNavigate('LoginScreen');
  } catch (error) {
    logger.error('Error during logout: ', error as Error);
  }
};
export default apiClient;
