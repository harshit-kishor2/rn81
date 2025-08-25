import { COLORS, FONTS } from '@app/theme';
import { useAppTheme } from '@app/theme/theme-provider';
import { rpFont } from '@app/utils/responsive-utils';
import React, { forwardRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  GestureResponderEvent,
  Pressable,
  ColorValue,
} from 'react-native';

interface AppTextProps extends Omit<TextProps, 'style'> {
  // Content props
  text?: string;
  children?: React.ReactNode | string;

  // Typography props
  variant?: TextVariant;
  align?: TextAlign;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  fontWeight?: FontWeight;
  color?: ColorValue;
  opacity?: number;

  // Text behavior props
  numberOfLines?: number;
  ellipsizeMode?: EllipsizeMode;
  textTransform?: TextTransform;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;

  // Style props
  style?: TextStyle | TextStyle[];

  // Interaction props
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;

  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: TextProps['accessibilityRole'];
  testID?: string;

  // Advanced props
  selectable?: boolean;
  selectionColor?: ColorValue;
  suppressHighlighting?: boolean;
}

const AppText = forwardRef<Text, AppTextProps>(
  (
    {
      // Content
      text,
      children,

      // Typography
      variant,
      align = 'auto',
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
      color,
      opacity,

      // Text behavior
      numberOfLines,
      ellipsizeMode,
      textTransform,
      adjustsFontSizeToFit = false,
      minimumFontScale,

      // Style
      style,

      // Interactions
      onPress,
      onLongPress,

      // Accessibility
      accessible,
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole,
      testID,

      // Advanced
      selectable,
      selectionColor,
      suppressHighlighting,

      ...props
    }: AppTextProps,
    ref,
  ) => {
    const theme = useAppTheme();

    // Get variant-based styles
    const variantStyles = useMemo(() => {
      if (!variant)
        return {
          fontSize: undefined,
          fontWeight: undefined,
          lineHeight: undefined,
          textTransform: undefined,
        };
      const variantMap: Record<
        TextVariant,
        {
          fontSize: number;
          fontWeight: FontWeight;
          lineHeight: number;
          textTransform?: TextTransform;
        }
      > = {
        h1: { fontSize: rpFont(32), fontWeight: '700', lineHeight: rpFont(40) },
        h2: { fontSize: rpFont(28), fontWeight: '700', lineHeight: rpFont(36) },
        h3: { fontSize: rpFont(24), fontWeight: '600', lineHeight: rpFont(32) },
        h4: { fontSize: rpFont(20), fontWeight: '600', lineHeight: rpFont(28) },
        h5: { fontSize: rpFont(18), fontWeight: '600', lineHeight: rpFont(24) },
        h6: { fontSize: rpFont(16), fontWeight: '600', lineHeight: rpFont(22) },
        body1: {
          fontSize: rpFont(16),
          fontWeight: '400',
          lineHeight: rpFont(24),
        },
        body2: {
          fontSize: rpFont(14),
          fontWeight: '400',
          lineHeight: rpFont(20),
        },
        subtitle1: {
          fontSize: rpFont(16),
          fontWeight: '500',
          lineHeight: rpFont(24),
        },
        subtitle2: {
          fontSize: rpFont(14),
          fontWeight: '500',
          lineHeight: rpFont(20),
        },
        caption: {
          fontSize: rpFont(12),
          fontWeight: '400',
          lineHeight: rpFont(16),
        },
        overline: {
          fontSize: rpFont(10),
          fontWeight: '500',
          lineHeight: rpFont(14),
          textTransform: 'uppercase',
        },
      };

      return variantMap[variant];
    }, [variant]);

    // Compute final text styles
    const textStyles = useMemo((): TextStyle => {
      return {
        textAlign: align,
        textTransform: textTransform || variantStyles.textTransform,
        color: color || (onPress ? COLORS.BLUE : theme.colors.text.primary),
        opacity,
        fontSize: fontSize || variantStyles.fontSize || rpFont(16),
        fontFamily: fontFamily || FONTS.ROBOTO.REGULAR,
        fontWeight: fontWeight || variantStyles.fontWeight || 'normal',
        lineHeight:
          lineHeight ||
          variantStyles.lineHeight ||
          (fontSize || variantStyles.fontSize || rpFont(16)) + 4,
      };
    }, [
      align,
      textTransform,
      variantStyles,
      color,
      onPress,
      theme.colors.text,
      opacity,
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
    ]);

    const isInteractive = !!(onPress || onLongPress);
    const content = text ?? children;

    // Determine accessibility role
    const finalAccessibilityRole =
      accessibilityRole || (isInteractive ? 'button' : undefined);

    // If interactive, wrap in Pressable
    if (isInteractive) {
      return (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={!onPress && !onLongPress}
          accessible={accessible !== false}
          accessibilityRole={finalAccessibilityRole}
          accessibilityLabel={
            accessibilityLabel ||
            (typeof content === 'string' ? content : undefined)
          }
          accessibilityHint={accessibilityHint}
          testID={testID}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            ref={ref}
            {...props}
            ellipsizeMode={ellipsizeMode}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            minimumFontScale={minimumFontScale}
            numberOfLines={numberOfLines}
            selectable={selectable}
            selectionColor={selectionColor}
            suppressHighlighting={suppressHighlighting}
            style={StyleSheet.flatten([textStyles, style])}
          >
            {content}
          </Text>
        </Pressable>
      );
    }

    // Non-interactive text
    return (
      <Text
        ref={ref}
        {...props}
        ellipsizeMode={ellipsizeMode}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        minimumFontScale={minimumFontScale}
        numberOfLines={numberOfLines}
        selectable={selectable}
        selectionColor={selectionColor}
        suppressHighlighting={suppressHighlighting}
        accessible={accessible !== false}
        accessibilityRole={finalAccessibilityRole}
        accessibilityLabel={
          accessibilityLabel ||
          (typeof content === 'string' ? content : undefined)
        }
        accessibilityHint={accessibilityHint}
        testID={testID}
        style={StyleSheet.flatten([textStyles, style])}
      >
        {content}
      </Text>
    );
  },
);

AppText.displayName = 'AppText';

export default AppText;
