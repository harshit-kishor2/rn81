import { useAppTheme } from '@app/theme/theme-provider';
import { rpFont, rpHeight, rpWidth } from '@app/utils/responsive-utils';
import React, { JSX, useMemo } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  DimensionValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import AppText from './AppText';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  // Content props
  title?: React.ReactNode;
  left?: JSX.Element;
  right?: JSX.Element;

  // State props
  loading?: boolean;
  disabled?: boolean;

  // Style props
  variant?: ButtonVariant;
  size?: ButtonSize;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  borderColor?: ColorValue;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;

  // Container style props
  buttonContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;

  // Interaction props
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;

  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;

  // Loading props
  loadingText?: string;
  loadingColor?: ColorValue;
}

const SIZE_CONFIG: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; fontSize: number }
> = {
  small: {
    height: rpHeight(36),
    paddingHorizontal: rpWidth(12),
    fontSize: rpFont(14),
  },
  medium: {
    height: rpHeight(48),
    paddingHorizontal: rpWidth(16),
    fontSize: rpFont(16),
  },
  large: {
    height: rpHeight(56),
    paddingHorizontal: rpWidth(24),
    fontSize: rpFont(18),
  },
};

const AppButton: React.FC<ButtonProps> = ({
  // Content
  title,
  left,
  right,

  // State
  loading = false,
  disabled = false,

  // Style
  variant = 'primary',
  size = 'medium',
  backgroundColor,
  textColor,
  borderColor,
  width,
  height,
  borderRadius,

  // Container styles
  buttonContainerStyle,
  titleContainerStyle,
  titleStyle,

  // Interactions
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,

  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  testID,

  // Loading
  loadingText,
  loadingColor,
}) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);

  const isInteractionDisabled = disabled || loading;

  const sizeConfig = SIZE_CONFIG[size];

  // Get variant-based styles
  const variantStyles = useMemo(
    () =>
      getVariantStyles(variant, theme, {
        backgroundColor,
        textColor,
        borderColor,
      }),
    [variant, backgroundColor, textColor, borderColor, theme],
  );

  const getOpacity = (isPressed: boolean) => {
    if (isInteractionDisabled) return 0.6;
    if (isPressed) return 0.8;
    return 1;
  };

  const accessibilityProps = {
    accessibilityRole: 'button' as const,
    accessibilityLabel:
      accessibilityLabel ?? (typeof title === 'string' ? title : 'Button'),
    accessibilityHint,
    accessibilityState: { disabled: isInteractionDisabled, busy: loading },
    testID,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={loadingColor || variantStyles.textColor}
            style={styles.loadingIndicator}
          />
          {loadingText && (
            <AppText
              style={StyleSheet.flatten([
                styles.titleStyle,
                {
                  color: variantStyles.textColor,
                  fontSize: sizeConfig.fontSize,
                },
                titleStyle,
              ])}
            >
              {loadingText}
            </AppText>
          )}
        </>
      );
    }
    return (
      <>
        {left && <View style={styles.leftContainer}>{left}</View>}
        {title && (
          <AppText
            style={StyleSheet.flatten([
              styles.titleStyle,
              {
                color: variantStyles.textColor,
                fontSize: sizeConfig.fontSize,
              },
              titleStyle,
            ])}
          >
            {title}
          </AppText>
        )}
        {right && <View style={styles.rightContainer}>{right}</View>}
      </>
    );
  };

  return (
    <Pressable
      onPress={isInteractionDisabled ? undefined : onPress}
      onPressIn={isInteractionDisabled ? undefined : onPressIn}
      onPressOut={isInteractionDisabled ? undefined : onPressOut}
      onLongPress={isInteractionDisabled ? undefined : onLongPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        {
          height: height ?? sizeConfig.height,
          width: width ?? '100%',
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderWidth: variantStyles.borderWidth,
          borderRadius: borderRadius ?? rpWidth(12),
          paddingHorizontal: sizeConfig.paddingHorizontal,
          opacity: getOpacity(pressed),
        },
        buttonContainerStyle,
      ]}
      disabled={isInteractionDisabled}
      {...accessibilityProps}
    >
      <View style={[styles.titleContainer, titleContainerStyle]}>
        {renderContent()}
      </View>
    </Pressable>
  );
};

export default AppButton;

const getVariantStyles = (
  variant: ButtonVariant,
  theme: ReturnType<typeof useAppTheme>,
  overrides: {
    backgroundColor?: ColorValue;
    textColor?: ColorValue;
    borderColor?: ColorValue;
  },
) => {
  const { backgroundColor, textColor, borderColor } = overrides;
  const base = {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  };

  const variants: Record<ButtonVariant, any> = {
    primary: {
      ...base,
      backgroundColor: backgroundColor || theme.colors.primary,
      textColor: textColor || theme.colors.text.primary,
    },
    secondary: {
      ...base,
      backgroundColor: backgroundColor || theme.colors.secondary,
      textColor: textColor || theme.colors.text.secondary,
    },
    outline: {
      ...base,
      backgroundColor: backgroundColor || 'transparent',
      borderColor: borderColor || theme.colors.primary,
      borderWidth: 1,
      textColor: textColor || theme.colors.primary,
    },
    ghost: {
      ...base,
      backgroundColor: backgroundColor || 'transparent',
      textColor: textColor || theme.colors.primary,
    },
  };

  return variants[variant];
};

const createStyles = () =>
  StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 1,
    },
    titleStyle: {
      fontWeight: '600',
      textAlign: 'center',
      marginLeft: 8,
    },
    leftContainer: {
      marginRight: 8,
    },
    rightContainer: {
      marginLeft: 8,
    },
    loadingIndicator: {
      // ActivityIndicator specific styles can go here
    },
  });
