import { Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { ms, mvs, s, vs } from 'react-native-size-matters';

export interface ScalingOptions {
  factor?: number;
  minValue?: number;
  maxValue?: number;
}

// Get screen dimensions and device info
const { width, height, fontScale } = Dimensions.get('window');

// Base design dimensions (update these to match your design)
export const DESIGN_GUIDELINES = {
  baseWidth: 375,
  baseHeight: 812,
  baseFontSize: 16,
} as const;

// Determine device characteristics
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];
const isTablet = shortDimension >= 768; // iPad mini and larger

/**
 * Utility function to clamp values between min and max
 */
const clamp = (value: number, min?: number, max?: number): number => {
  let result = value;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
};

/**
 * Scale size based on screen width relative to the design guideline width.
 * @param size - Size to scale.
 * @param options - Scaling options including factor, min, and max values.
 * @returns Scaled size.
 */
export const rpWidth = (size: number, options: ScalingOptions = {}): number => {
  const { minValue = 0, maxValue } = options;
  const scaledSize = (shortDimension / DESIGN_GUIDELINES.baseWidth) * size;
  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Scale size based on screen height relative to the design guideline height.
 * @param size - Size to scale.
 * @param options - Scaling options including factor, min, and max values.
 * @returns Scaled size.
 */
export const rpHeight = (
  size: number,
  options: ScalingOptions = {},
): number => {
  const { minValue = 0, maxValue } = options;
  const scaledSize = (longDimension / DESIGN_GUIDELINES.baseHeight) * size;
  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Scale size based on screen width (alias for rpWidth for backward compatibility).
 * @param size - Size to scale.
 * @param options - Scaling options.
 * @returns Scaled size.
 */
export const rpAround = (size: number, options: ScalingOptions = {}): number =>
  rpWidth(size, options);

/**
 * Moderately scale size based on screen width.
 * @param size - Original size.
 * @param factor - Scaling factor (0 = no scaling, 1 = full scaling).
 * @param options - Additional scaling options.
 * @returns Moderately scaled size.
 */
export const rpWidthModerate = (
  size: number,
  factor: number = 0.5,
  options: ScalingOptions = {},
): number => {
  const { minValue, maxValue } = options;
  const scaledSize = size + (rpWidth(size) - size) * factor;
  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Moderately scale size based on screen height.
 * @param size - Original size.
 * @param factor - Scaling factor (0 = no scaling, 1 = full scaling).
 * @param options - Additional scaling options.
 * @returns Moderately scaled size.
 */
export const rpHeightModerate = (
  size: number,
  factor: number = 0.5,
  options: ScalingOptions = {},
): number => {
  const { minValue, maxValue } = options;
  const scaledSize = size + (rpHeight(size) - size) * factor;
  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Scale size as a percentage of the screen height.
 * @param percentage - Percentage of the height (e.g., 50 for 50%).
 * @param options - Additional scaling options.
 * @returns Scaled size.
 */
export const rpHeightPercentage = (
  percentage: number,
  options: ScalingOptions = {},
): number => {
  const { minValue, maxValue } = options;
  const scaledSize = (longDimension * percentage) / 100;
  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Scale size as a percentage of the screen width.
 * @param percentage - Percentage of the width (e.g., 50 for 50%).
 * @param options - Additional scaling options.
 * @returns Scaled size.
 */
export const rpWidthPercentage = (
  percentage: number,
  options: ScalingOptions = {},
): number => {
  const { minValue, maxValue } = options;
  const scaledSize = (shortDimension * percentage) / 100;
  return clamp(scaledSize, minValue, maxValue);
};

// Font scaling functions with enhanced options
/**
 * Scale font size proportionally based on the screen's longer dimension.
 * Considers device font scale settings and provides bounds.
 * @param size - Font size to scale.
 * @param options - Additional scaling options.
 * @returns Scaled font size.
 */
export const rpFont = (size: number, options: ScalingOptions = {}): number => {
  const { minValue = 10, maxValue = 100 } = options;
  let scaledSize = RFValue(size, longDimension);

  // Consider user's font scale preference but limit extreme scaling
  const fontScaleFactor = Math.min(fontScale, 1.3); // Cap at 30% increase
  scaledSize *= fontScaleFactor;

  return clamp(scaledSize, minValue, maxValue);
};

/**
 * Scale font size as a percentage of the screen dimensions.
 * @param percentage - Font size as a percentage (e.g., 2.5 for 2.5%).
 * @param options - Additional scaling options.
 * @returns Scaled font size.
 */
export const rpFontPercentage = (
  percentage: number,
  options: ScalingOptions = {},
): number => {
  const { minValue = 8, maxValue = 80 } = options;
  const scaledSize = RFPercentage(percentage);
  return clamp(scaledSize, minValue, maxValue);
};

// Enhanced font scaling with device considerations
/**
 * Intelligent font scaling that considers device type and user preferences.
 * @param size - Base font size.
 * @param options - Scaling options with device-specific adjustments.
 * @returns Optimally scaled font size.
 */
export const rpFontSmart = (
  size: number,
  options: ScalingOptions = {},
): number => {
  const { factor = 0.5, minValue = 10, maxValue = 100 } = options;

  let scaledSize;
  // Different scaling strategies for different devices
  if (isTablet) {
    // Tablets: more conservative scaling
    scaledSize = size + (rpWidth(size) - size) * (factor * 0.7);
  } else {
    // Phones: standard scaling
    scaledSize = size + (rpWidth(size) - size) * factor;
  }

  // Apply font scale with limits
  const fontScaleFactor = Math.min(Math.max(fontScale, 0.8), 1.3);
  scaledSize *= fontScaleFactor;

  return clamp(scaledSize, minValue, maxValue);
};

// Re-export functions from react-native-size-matters with type safety
/**
 * Scale a value based on the standard scale factor.
 * @param size - Original size.
 * @returns Scaled size.
 */
export const scale = (size: number): number => s(size);

/**
 * Scale a value based on the vertical scale factor.
 * @param size - Original size.
 * @returns Scaled vertical size.
 */
export const verticalScale = (size: number): number => vs(size);

/**
 * Scale a value moderately based on the standard scale factor.
 * @param size - Original size.
 * @param factor - Scaling factor (default: 0.5).
 * @returns Moderately scaled size.
 */
export const moderateScale = (size: number, factor?: number): number =>
  ms(size, factor);

/**
 * Scale a value moderately based on the vertical scale factor.
 * @param size - Original size.
 * @param factor - Scaling factor (default: 0.5).
 * @returns Moderately scaled vertical size.
 */
export const moderateVerticalScale = (size: number, factor?: number): number =>
  mvs(size, factor);
