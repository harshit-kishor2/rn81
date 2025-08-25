import useAppState from '@app/hooks/useAppState';
import LottieView from 'lottie-react-native';
import React, { Component, useRef } from 'react';

type extractComponentPropsType<Type> = Type extends Component<infer X>
  ? X
  : null;

// See https://github.com/react-native-community/lottie-react-native/issues/426
type LottieProps = extractComponentPropsType<LottieView>;

/**
 * AppLottie is a wrapper component for LottieView that handles the animation state.
 * It resumes the animation when the app becomes active.
 *
 * @see https://github.com/react-native-community/lottie-react-native/issues/412
 * Lottie has a known bug that stops animation when in the background on iOS.
 * This component is a workaround for that issue.
 * @example
 * <AppLottie
 *   source={require('./path/to/animation.json')}
 *   autoPlay
 *   loop
 *   style={{width: 100, height: 100}}
 * />
 */

const AppLottie: React.FC<LottieProps> = ({ ...rest }) => {
  // Reference to the LottieView component to control playback
  const lottieRef = useRef<LottieView>(null);

  // Hook to manage app state changes
  useAppState({
    onAppActive: () => {
      // Play the animation when the app becomes active
      lottieRef.current?.play();
    },
  });

  // Render the LottieView component, passing all props and the ref
  return <LottieView ref={lottieRef} {...rest} />;
};

export default AppLottie;
