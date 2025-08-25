import { useAppTheme } from '@app/theme/theme-provider';
import React, { ReactNode } from 'react';
import {
  DimensionValue,
  FlexAlignType,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppContainerProps {
  useSafeArea?: boolean;
  children: ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  padding?: DimensionValue;
  paddingHorizontal?: DimensionValue;
  paddingVertical?: DimensionValue;
  margin?: DimensionValue;
  marginHorizontal?: DimensionValue;
  marginVertical?: DimensionValue;
  alignItems?: FlexAlignType;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  style?: ViewStyle;
  statusBarHidden?: boolean;
  translucent?: boolean;
}

const AppContainer: React.FC<AppContainerProps> = ({
  useSafeArea = true,
  children,
  backgroundColor,
  statusBarColor,
  padding = 0,
  paddingHorizontal,
  paddingVertical,
  margin = 0,
  marginHorizontal,
  marginVertical,
  alignItems,
  justifyContent,
  style,
  statusBarHidden = false,
  translucent = false,
}) => {
  const theme = useAppTheme();

  // Determine bar style based on theme
  const barStyle =
    theme.themeType === 'dark' ? 'light-content' : 'dark-content';

  // Choose container component based on useSafeArea prop
  const ContainerView = useSafeArea ? SafeAreaView : View;

  // Compute final background color
  const finalBackgroundColor =
    backgroundColor ?? theme.colors.background.primary;

  return (
    <ContainerView
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: finalBackgroundColor,
          padding,
          paddingHorizontal,
          paddingVertical,
          margin,
          marginHorizontal,
          marginVertical,
          alignItems,
          justifyContent,
        },
        style,
      ])}
    >
      <StatusBar
        barStyle={barStyle}
        backgroundColor={statusBarColor ?? finalBackgroundColor}
        hidden={statusBarHidden}
        translucent={translucent}
      />
      {children}
    </ContainerView>
  );
};

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
