import { rpFont } from '@app/utils/responsive-utils';
import { _SVG_ICONS, _SVG_ICONS_MAP } from '@assets/svgs';
import React, { useMemo } from 'react';
import { ColorValue, Pressable, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SVGIconProps extends Omit<SvgProps, 'width' | 'height'> {
  // Core props
  icon: _SVG_ICONS;
  height?: number | string;
  width?: number | string;

  // Color props
  pathFill?: ColorValue;
  fill?: ColorValue;
  stroke?: ColorValue;

  // Style props
  style?: ViewStyle;

  // Interaction props
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;

  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'image' | 'button';
  testID?: string;

  // Animation props
  animated?: boolean;

  // Size variants
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * AppSvg is a functional component that renders an SVG icon with enhanced features.
 * It provides flexible sizing, theming, interactions, and accessibility support.
 *
 * @param {SVGIconProps} props - The properties for the SVG icon component.
 * @param {SVG_ICONS} props.icon - The icon type to be rendered, defined in the SVG_ICONS enum.
 * @param {number|string} [props.height] - Optional height for the SVG icon.
 * @param {number|string} [props.width] - Optional width for the SVG icon.
 * @param {ColorValue} [props.pathFill] - Optional fill color for the SVG paths.
 * @param {ColorValue} [props.fill] - Optional fill color (alternative to pathFill).
 * @param {ColorValue} [props.stroke] - Optional stroke color for the SVG.
 * @param {string} [props.size] - Predefined size variant (xs, sm, md, lg, xl).
 * @param {Function} [props.onPress] - Optional press handler for interactive icons.
 * @param {boolean} [props.disabled=false] - Whether the icon is disabled (affects opacity).
 * @param {string} [props.accessibilityLabel] - Accessibility label for screen readers.
 */
const AppSvg: React.FC<SVGIconProps> = ({
  // Core props
  icon,
  height,
  width,

  // Color props
  pathFill,
  fill,
  stroke,

  // Style props
  style,

  // Interaction props
  onPress,
  onLongPress,
  disabled = false,

  // Accessibility props
  accessible,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,

  // Animation props
  animated = false,

  // Size variants
  size,

  // Rest of SVG props
  ...restProps
}) => {
  // Size configuration for predefined sizes
  const sizeConfig = useMemo(() => {
    if (!size) return { height: undefined, width: undefined };

    const sizeMap = {
      xs: { height: rpFont(16), width: rpFont(16) },
      sm: { height: rpFont(20), width: rpFont(20) },
      md: { height: rpFont(24), width: rpFont(24) },
      lg: { height: rpFont(32), width: rpFont(32) },
      xl: { height: rpFont(48), width: rpFont(48) },
    };

    return sizeMap[size];
  }, [size]);

  // Calculate final dimensions
  const finalDimensions = useMemo(
    () => ({
      height: height ?? sizeConfig.height ?? rpFont(24),
      width: width ?? sizeConfig.width ?? rpFont(24),
    }),
    [height, width, sizeConfig],
  );

  // Get the icon component
  const IconComponent = useMemo(() => {
    const IconsImage = _SVG_ICONS_MAP[icon];

    if (!IconsImage) {
      console.warn(`AppSvg: Icon "${icon}" not found in SVG_ICONS_MAP`);
      return null;
    }

    return IconsImage;
  }, [icon]);

  // Determine fill color with priority: fill > pathFill > default
  const finalFill = useMemo(() => {
    return fill || pathFill || '#000000';
  }, [fill, pathFill]);

  // Determine accessibility role
  const finalAccessibilityRole = useMemo(() => {
    if (accessibilityRole) return accessibilityRole;
    return onPress || onLongPress ? 'button' : 'image';
  }, [accessibilityRole, onPress, onLongPress]);

  // Create icon props
  const iconProps = useMemo(
    () => ({
      ...restProps,
      height: finalDimensions.height,
      width: finalDimensions.width,
      pathFill: finalFill,
      fill: finalFill,
      stroke,
      style: [
        style,
        {
          opacity: disabled ? 0.5 : 1,
        },
        animated &&
          {
            // Add animation styles if needed
          },
      ],
      accessible: accessible !== false,
      accessibilityLabel: accessibilityLabel || `${icon} icon`,
      accessibilityHint,
      accessibilityRole: finalAccessibilityRole,
      testID,
    }),
    [
      restProps,
      finalDimensions,
      finalFill,
      stroke,
      style,
      disabled,
      animated,
      accessible,
      accessibilityLabel,
      accessibilityHint,
      finalAccessibilityRole,
      testID,
      icon,
    ],
  );

  // Early return if no icon component found
  if (!IconComponent) {
    if (__DEV__) {
      return null; // Or render a fallback icon in development
    }
    return null;
  }

  // Render interactive icon (wrapped in Pressable)
  const renderInteractiveIcon = () => {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        accessible={accessible !== false}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${icon} button`}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID ? `${testID}-button` : undefined}
      >
        <IconComponent {...iconProps} />
      </Pressable>
    );
  };

  // Render static icon
  const renderStaticIcon = () => <IconComponent {...iconProps} />;

  // Return interactive or static version based on props
  return onPress || onLongPress ? renderInteractiveIcon() : renderStaticIcon();
};

AppSvg.displayName = 'AppSvg';

export default AppSvg;

// Usage Examples:

// 1. Basic icon with default styling
/* <AppSvg icon={SVG_ICONS.HOME} /> */

// 2. Icon with custom size
/* <AppSvg
  icon={SVG_ICONS.USER}
  height={32}
  width={32}
  pathFill="#007AFF"
/> */

// 3. Icon with predefined size variant
/* <AppSvg
  icon={SVG_ICONS.SETTINGS}
  size="lg"
  fill="#FF6B35"
/> */

// 4. Interactive icon with press handler
/* <AppSvg
  icon={SVG_ICONS.CLOSE}
  size="md"
  onPress={handleClose}
  accessibilityLabel="Close dialog"
  accessibilityHint="Closes the current dialog"
/> */

// 5. Styled icon with stroke
/* <AppSvg
  icon={SVG_ICONS.HEART}
  size="xl"
  fill="transparent"
  stroke="#E74C3C"
  strokeWidth={2}
  style={{ margin: 8 }}
/> */

// 6. Disabled interactive icon
/* <AppSvg 
  icon={SVG_ICONS.SAVE} 
  size="md"
  onPress={handleSave}
  disabled={!canSave}
  pathFill={canSave ? "#28A745" : "#6C757D"}
  testID="save-button"
/> */
