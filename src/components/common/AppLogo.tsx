import React, { FC, useMemo } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  ColorValue,
  Pressable,
  StyleSheet,
} from 'react-native';
import AppSvg from './AppSvg';
import { rpHeight, rpWidth } from '@app/utils/responsive-utils';
import ASSETS from '@app/constants/assets';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type LogoVariant = 'default' | 'mono' | 'outline' | 'inverse';

interface AppLogoProps {
  // Size props
  height?: number;
  width?: number;
  size?: LogoSize;

  // Style props
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  // Variant props
  variant?: LogoVariant;
  color?: ColorValue;
  backgroundColor?: ColorValue;

  // Behavior props
  maintainAspectRatio?: boolean;
  rounded?: boolean;
  borderRadius?: number;

  // Interaction props
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;

  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;

  // Animation props
  animated?: boolean;
  animationDuration?: number;
}

const AppLogo: FC<AppLogoProps> = ({
  // Size props
  height,
  width,
  size = 'md',

  // Style props
  style,
  containerStyle,
  backgroundColor,

  // Behavior props
  maintainAspectRatio = true,
  rounded = false,
  borderRadius,

  // Interaction props
  onPress,
  onLongPress,
  disabled = false,

  // Accessibility props
  accessible,
  accessibilityLabel = 'App Logo',
  accessibilityHint,
  testID,

  // Animation props
  animated = false,
}) => {
  // Size configuration based on size prop
  const sizeConfig = useMemo(() => {
    const sizeMap = {
      xs: { height: rpHeight(24), width: rpWidth(24) },
      sm: { height: rpHeight(32), width: rpWidth(32) },
      md: { height: rpHeight(48), width: rpWidth(48) },
      lg: { height: rpHeight(64), width: rpWidth(64) },
      xl: { height: rpHeight(100), width: rpWidth(100) },
      xxl: { height: rpHeight(128), width: rpWidth(128) },
    };
    return sizeMap[size];
  }, [size]);

  // Calculate final dimensions
  const finalDimensions = useMemo(() => {
    let finalHeight = height ?? sizeConfig.height;
    let finalWidth = width ?? sizeConfig.width;

    // Maintain aspect ratio if requested and only one dimension is provided
    if (maintainAspectRatio) {
      if (height && !width) {
        finalWidth = height; // Assuming logo is square
      } else if (width && !height) {
        finalHeight = width; // Assuming logo is square
      }
    }

    return { height: finalHeight, width: finalWidth };
  }, [height, width, sizeConfig, maintainAspectRatio]);

  // Container style with optional interactions
  const containerStyles: StyleProp<ViewStyle> = useMemo(
    () => [
      {
        height: finalDimensions.height,
        width: finalDimensions.width,
        backgroundColor,
        borderRadius: rounded ? finalDimensions.height / 2 : borderRadius,
        opacity: disabled ? 0.5 : 1,
      },
      animated &&
        {
          // Add animation properties if needed
        },
      containerStyle,
    ],
    [
      finalDimensions,
      backgroundColor,
      rounded,
      borderRadius,
      disabled,
      animated,
      containerStyle,
    ],
  );

  // Render interactive logo (with Pressable)
  const renderInteractiveLogo = () => {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
        accessible={accessible !== false}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
        style={({ pressed }) => [containerStyles, pressed && { opacity: 0.7 }]}
      >
        <AppSvg
          icon={ASSETS.SVGS.APP}
          height={finalDimensions.height}
          width={finalDimensions.width}
          style={StyleSheet.flatten([style])}
        />
      </Pressable>
    );
  };

  // Render static logo
  const renderStaticLogo = () => (
    <View
      style={containerStyles}
      accessible={accessible !== false}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <AppSvg
        icon={ASSETS.SVGS.APP}
        height={finalDimensions.height}
        width={finalDimensions.width}
        style={StyleSheet.flatten([style])}
      />
    </View>
  );

  // Return interactive or static version based on props
  return onPress || onLongPress ? renderInteractiveLogo() : renderStaticLogo();
};

AppLogo.displayName = 'AppLogo';

export default AppLogo;

// Usage Examples:

// 1. Basic Logo with default size
/* <AppLogo /> */

// 2. Custom size logo
/* <AppLogo height={120} width={120} /> */

// 3. Predefined size logo
/* <AppLogo size="xl" /> */

// 4. Interactive logo with variant
/* <AppLogo
  size="lg"
  variant="outline"
  onPress={() => console.log('Logo pressed!')}
  accessibilityHint="Navigate to home screen"
/> */

// 5. Styled logo with background
/* <AppLogo
  size="md"
  backgroundColor="#f0f0f0"
  rounded
  color="#007AFF"
  containerStyle={{ margin: 16 }}
/> */

// 6. Logo with custom dimensions and styling
/* <AppLogo 
  height={80}
  width={120}
  maintainAspectRatio={false}
  borderRadius={8}
  backgroundColor="rgba(0,0,0,0.1)"
  style={{ opacity: 0.8 }}
  testID="app-logo"
/> */
