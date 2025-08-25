import { Platform, Dimensions, ScaledSize } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-screen-helper';

//=============================

// ! Screen Constants
const Screen: ScaledSize = Dimensions.get('screen');

/**
 * @description
 * The width of the screen.
 * @type {number}
 */
const screenWidth: number = Screen.width;

/**
 * @description
 * The height of the screen.
 * @type {number}
 */
const screenHeight: number = Screen.height;

/**
 * @description
 * The scale of the screen.
 * @type {number}
 */
const screenScale: number = Screen.scale;

/**
 * @description
 * The font scale of the screen.
 * @type {number}
 */
const screenFontScale: number = Screen.fontScale;

//=============================

// ! Window Constants

const Window: ScaledSize = Dimensions.get('window');

/**
 * @description
 * The width of the window.
 * @type {number}
 */
const windowWidth: number = Window.width;

/**
 * @description
 * The height of the window.
 * @type {number}
 */
const windowHeight: number = Window.height;

/**
 * @description
 * The scale of the window.
 * @type {number}
 */
const windowScale: number = Window.scale;

/**
 * @description
 * The font scale of the window.
 * @type {number}
 */
const windowFontScale: number = Window.fontScale;

/**
 * @description
 * The orientation of the window.
 * @type {boolean}
 */
const isLandscape = Window.width > Window.height;

//=============================

// ! Iphone related from react-native-iphone-screen-helper library
/**
 * @description
 * true if you're running on an iPhone X or a newer model with a notch or dynamic island.
 * @type {boolean}
 */
const isIphoneXOrNewer: boolean = isIphoneX();

/**
 * @description
 * The height of the bottom to fit the safe area: 34 for iPhone X and newer models with a notch or dynamic island
 * and 0 for other devices.
 *
 */
const bottomSpace: number = getBottomSpace();

/**
 *
 * 62 for safe iPhone 16 Pro Max
 *
 * 59 for safe iPhone 14 Pro, 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro
 *
 * 50 for safe iPhone 12 Mini, 13 Mini
 *
 * 47 for safe iPhone 12, 12 Pro, 12 Pro Max, 13, 13 Pro, 13 Pro Max, 14, 14 Plus
 *
 * 44 for safe iPhone X, Xs, Xs Max, 11 Pro, 11 Pro Max
 *
 * 8 for safe iPhone Xr, 11
 *
 * 20 for other devices
 *
 * StatusBar.currentHeight for Android.
 *
 */
const statusBarHeight: number = getStatusBarHeight();

// ==============================

// ! Platform related
/**
 * @description
 * Determines whether the app is running on iOS.
 * @type {boolean}
 */
const isIOS: boolean = Platform.OS === 'ios';

/**
 * @description
 * Determines whether the app is running on android.
 * @type {boolean}
 */
const isAndroid: boolean = Platform.OS === 'android';

/**
 * @description
 * Gets the version number of the platform.
 */
const platformVersion = Platform.Version;

// ==============================

// ! Device Info related from react-native-device-info

/**
 * @description
 * Checks if the device has a notch.
 * @type {boolean}
 */
const hasNotch: boolean = DeviceInfo.hasNotch();

/**
 * @description
 * Checks if the device has a notch but not a dynamic island.
 * @type {boolean}
 */
const hasNotchOnly: boolean =
  DeviceInfo.hasNotch() && !DeviceInfo.hasDynamicIsland();

/**
 * @description
 * Checks if the device has a dynamic island.
 * @type {boolean}
 */
const hasDynamicIsland: boolean = DeviceInfo.hasDynamicIsland();

/**
 * @description
 * Checks if the device is a tablet.
 * @type {boolean}
 */
const isTablet: boolean = DeviceInfo.isTablet();

/**
 * @description
 * The bundle identifier of the app.
 * @type {string}
 */
const BUNDLE_ID: string = DeviceInfo.getBundleId();

/**
 * @description
 * The name of the app.
 * @type {string}
 */
const APP_NAME: string = DeviceInfo.getApplicationName();

/**
 * @description
 * The version of the app which is set in the app's build configuration.
 * @type {string}
 */
const BUILD_VERSION: string = DeviceInfo.getVersion();

/**
 * @description
 * The build number of the app which is set in the app's build configuration.
 * @type {string | number}
 */
const BUILD_NUMBER: string | number = DeviceInfo.getBuildNumber();

// Default the constants as an object
const DeviceUtils = {
  screenWidth,
  screenHeight,
  screenScale,
  screenFontScale,
  windowWidth,
  windowHeight,
  windowScale,
  windowFontScale,
  isLandscape,
  isIphoneXOrNewer,
  bottomSpace,
  statusBarHeight,
  isIOS,
  isAndroid,
  platformVersion,
  hasNotch,
  hasNotchOnly,
  hasDynamicIsland,
  isTablet,
  BUNDLE_ID,
  APP_NAME,
  BUILD_VERSION,
  BUILD_NUMBER,
};

export default DeviceUtils;
