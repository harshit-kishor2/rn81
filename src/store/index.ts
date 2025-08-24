import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {MMKV} from 'react-native-mmkv';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  Storage,
} from 'redux-persist';

import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import rootReducer from './slices/reducers';

const storage = new MMKV({
  id: `redux-local-storage`,
  encryptionKey: 'reduxLocalStorageEncryptionKey',
});

const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

/**
 * Persist configuration
 * key: The key to store the state in storage
 * storage: The storage object used to persist the state
 * version: The version of the state to persist
 * blacklist: An array of reducer keys to exclude from persistence
 * whitelist: An array of reducer keys to include in persistence
 */
const persistConfig = {
  key: 'root_redux_states',
  storage: reduxStorage,
  version: 1,
  whitelist: [],
};

// all reducers are persisted here
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Common middlewares
const middlewares: any[] = [
  //! you can put your middlewares here like redux-logger
];

export const reduxStore = configureStore({
  reducer: persistedReducer,
  /**
   * Configures the middleware for the store.
   * @param {Function} getDefaultMiddleware A function that returns the default middleware.
   * @return {Array<Middleware>} An array of middleware.
   *
   * The `serializableCheck` options are used to ignore certain actions and state paths
   * from the serializability check. These are used to ignore actions and state that are
   * not serializable, such as functions, promises, and other non-serializable values.
   * The `immutableCheck` option is set to false to disable the immutable check, which
   * is not needed in this case because the state is already immutable.
   * `ignoreActionPaths` and `ignorePaths` are used to ignore actions and state paths
   *
   * The middleware array is concatenated with the `middlewares` array, which is an array
   * of middleware functions that are defined elsewhere in the codebase.
   */
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: [],
        ignoredPaths: [],
      },
    }).concat(middlewares),
  devTools: __DEV__,
});

// Persist the store
export const persistor = persistStore(reduxStore);
setupListeners(reduxStore.dispatch);

/**
 * This function is used to clear the persisted state of the Redux store.
 * @returns {void}
 */
export const purgePersistedState = (): void => {
  persistor.purge();
};

/**
 * The root state of the Redux store.
 *
 * This type is inferred from the return value of `reduxStore.getState()`.
 */
export type RootState = ReturnType<typeof reduxStore.getState>;

/**
 * The dispatch function of the Redux store.
 *
 * This type is inferred from the type of `reduxStore.dispatch`.
 */
export type AppDispatch = typeof reduxStore.dispatch;

/**
 * Custom hook to dispatch actions to the Redux store.
 *
 * @returns A dispatch function for dispatching actions.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Custom hook to select state from the Redux store.
 *
 * @type {TypedUseSelectorHook<RootState>}
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
